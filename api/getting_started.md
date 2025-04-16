
<script setup>
  let apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAiVEZNIiwKICAiaWF0IjogMTczOTkxOTYwMCwKICAiZXhwIjogMTg5NzY4NjAwMAp9.L28Sk6wzRLoUh1wLz_TjeY_rtUp3UX3-6UttadUEoC0';
  apikey = "[apikey]";
  let endpoint = "http://116.203.31.116:8000/rest/v1/";
</script>

# Getting Started

This guide will help you get started with the `ICP-Forest` data taken in Brandenburg Germany. The data is collected by the Landesbetrieb Forst Brandenburg and is part of the ICP-Forest network. The data is collected in the framework of the Level I and Level II monitoring programs. The Level I program is a systematic network of permanent observation plots, while the Level II program is a network of intensive monitoring plots.

## Endpoint

The base URL for the API is `http://116.203.31.116:8000/rest/v1/`. All requests should start with this URL.

## Authentication

The API requires an API key to be passed in the header of each request. The API key is a JSON Web Token (JWT) and is used to authenticate the user. The API key is passed in the `apikey` header.

::: warning Request the API Key
Get your API key by contacting the <Waldmonitoring@LFB.Brandenburg.de>.

The API key should be kept secret and should not be shared with anyone. If you suspect that your API key has been compromised, you should generate a new one.
:::

```cURL-vue
curl -X GET "{{endpoint}}"
    -H "apikey: [APIKEY]"

```

*Note: Replace `[APIKEY]` with your actual API key.*

## Schema Selection

The second header required is the `Accept-Profile` header. This can be `icp_download` or `icp_dictionaries` .

```cURL-vue
curl -X GET "{{endpoint}}"
    -H "apikey: {{ apikey }}"
    -H "Accept-Profile: icp_download"  
```
*Note: Replace `[APIKEY]` with your actual API key.*

## Format selection

The API can return data in either CSV or JSON format. The format is specified in the `Accept` header.

::: code-group

```cURL-vue [JSON (default)]
curl -X GET "{{endpoint}}"
    -H "apikey: {{ apikey }}"
    -H "Accept-Profile: icp_download" 
    -H "Accept: application/json"
```

```cURL-vue [CSV]
curl -X GET "{{endpoint}}"
    -H "apikey: {{ apikey }}"
    -H "Accept-Profile: icp_download" 
    -H "Accept: text/csv"   
```

:::