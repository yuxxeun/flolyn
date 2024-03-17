<script>
  let url = '';
  let loading = false;
  let error = '';
  let response = null;
  let ipInfo = null;

  const getIpAddress = async (domain) => {
    const apiUrl = `https://dns.google/resolve?name=${domain}&type=A`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.Answer && data.Answer.length > 0) {
        return data.Answer[0].data;
      } else {
        throw new Error('IP address not found');
      }
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  };

  const checkUrl = async () => {
    loading = true;
    error = '';

    try {
      let finalUrl = url;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }
      const startTime = performance.now(); 
      const res = await fetch(finalUrl);
      const endTime = performance.now(); 
      const responseTime = endTime - startTime;

      if (res.ok) {
        const headers = {};
        res.headers.forEach((value, key) => {
          headers[key] = value;
        });

        const metadata = {
          contentType: headers['content-type'] || 'Tidak Tersedia',
          contentLength: headers['content-length'] || 'Tidak Tersedia',
        };

        const secureConnection = res.url.startsWith('https://');

        response = {
          status: res.status,
          responseTime: Math.round(responseTime),
          headers,
          metadata,
          secureConnection,
        };

        const domain = new URL(finalUrl).hostname;
        const ipAddress = await getIpAddress(domain);
        ipInfo = { domain, ipAddress };
      } else {
        throw new Error('Not Found');
      }
    } catch (err) {
      error = '404 - Halaman tidak ditemukan';
    }

    loading = false;
    url = '';
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { 
      checkUrl();
    }
  }
</script>

<div class="  ">
  <div class="flex items-center space-x-3">
    <div class="border max-w-sm space-x-2 h-10 border-rose-400 flex px-1 items-center justify-between bg-rose-400 rounded-lg">
      <label for="" class="px-1 font-bold text-white">
        https://
      </label>
      <input 
        autofocus 
        bind:value={url} 
        on:keydown={handleKeyDown}
        placeholder="Masukkan URL di sini"
        class="px-2 py-2 w-full h-8 rounded-lg focus:outline-none outline:none outline:border-none active:border-none" 
      />
    </div>
    <div>
      <button 
        on:click={checkUrl} 
        disabled={loading}
        class="bg-rose-400 rounded-lg font-semibold px-3 py-1.5 text-white text-lg"
      >
        Check URL ->
      </button>
    </div>
  </div>
  <div class="mt-10 p-5 rounded-lg bg-white/30 backdrop-blur-lg max-w-lg">
    <div>
      <h3 class="text-xl font-semibold">Inforamasi URL</h3>
    </div>
    <div>

    </div>
  </div>
  {#if loading}
    <div>Sedang memeriksa...</div>
  {/if}
  {#if error}
    <div>{error}</div>
  {/if}
  {#if response}
    <div class="mt-5 max-w-lg p-5 bg-white/30 backdrop-blur-lg">
      <h3 class="text-xl font-semibold rounded-lg py-1 px-3">
        Informasi URL
      </h3>
      <div class="px-5">
        <p>Status Kode: {response.status}</p>
        <p>Waktu Respons: {response.responseTime} ms</p>
      </div>
    </div>

    <div class="mt-5 max-w-lg p-5 bg-white/30 backdrop-blur-lg">
      <h4 class=" font-semibold text-xl rounded-lg py-1 px-3">
        Headers
      </h4>
      <div class="px-5">
        <ul>
          {#each Object.entries(response.headers) as [key, value]}
            <li>{key}: {value}</li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="mt-5 max-w-lg p-5 bg-white/30 backdrop-blur-lg">
      <h4 class="text-xl font-semibold rounded-lg py-1 px-3">
        Metadata
      </h4>
      <div class="px-5">
        <ul>
          <li>Content-Type: {response.metadata.contentType}</li>
          <li>Content-Length: {response.metadata.contentLength}</li>
        </ul>
      </div>
    </div>

    <div class="mt-5 max-w-lg p-5 bg-white/30 backdrop-blur-lg">
      <h4 class="text-xl font-semibold rounded-lg py-1 px-3">
        Status Koneksi
      </h4>
      <div class="px-5">
        <p>{#if response.secureConnection} 
          Koneksi Aman (HTTPS) 
        {:else} 
          Koneksi Tidak Aman (HTTP) 
        {/if}</p>
      </div>
    </div>

    {#if ipInfo}
      <div class="mt-5 max-w-lg p-5 bg-white/30 backdrop-blur-lg">
        <h4 class="text-xl font-semibold rounded-lg py-1 px-3">
          Informasi IP
        </h4>
        <div class="px-5">
          <p>Domain: {ipInfo.domain}</p>
          <p>IP Address: {ipInfo.ipAddress}</p>
        </div> 
      </div>
    {/if}
  {/if}
</div>
