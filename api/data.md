<script setup>
  import DashboardButton from '../components/RestDocumentation.vue'
</script>

# Data

[ICP Forests Documentation - Surveys](https://www.icp-forests.org/documentation/Surveys/index.html)

## Request Data overview

```cURL-vue
curl -X GET "{{endpoint}}"
    -H "apikey: {{ apikey }}"
    -H "Accept-Profile: icp_download"  
```

*Note: Replace `[APIKEY]` with your actual API key.*

<DashboardButton type="icp_download" />