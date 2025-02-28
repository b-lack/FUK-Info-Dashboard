<script setup>
    import DashboardButton from '../components/RestDocumentation.vue'
    let apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAiVEZNIiwKICAiaWF0IjogMTczOTkxOTYwMCwKICAiZXhwIjogMTg5NzY4NjAwMAp9.L28Sk6wzRLoUh1wLz_TjeY_rtUp3UX3-6UttadUEoC0';
    apikey = "[apikey]";
    let endpoint = "http://116.203.31.116:8000/rest/v1/";
</script>

# Dictionary

[ICP Forests Documentation](https://www.icp-forests.org/documentation/Dictionaries/index.html)

## Request Dictionaries overview
```cURL-vue
curl -X GET "{{endpoint}}"
    -H "apikey: {{ apikey }}"
    -H "Accept-Profile: icp_dictionaries"  
```
*Note: Replace `[APIKEY]` with your actual API key.*

<DashboardButton type="icp_dictionaries" />