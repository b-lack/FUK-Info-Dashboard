<script setup>
    let apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w";
    //apikey = '[apikey]';
    let endpoint = "http://116.203.31.116:8000";
</script>

# For Authenticated Users

This section is for authenticated users. You need to login to get an access token. The access token is required to access the data.

## Login

Sign in with email and password to get access token.

::: code-group

```R-vue
library(httr)

# Credentials
email <- "something@email.de"
password <- "fdo8zsdb3rfs"

headers = c(
  'Content-Type' = 'text/plain',
  'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w'
)

body = paste0("{\n    \"email\": \"", email, "\",\n    \"password\": \"", password, "\"\n}")

res <- VERB("POST", url = "http://116.203.31.116:8000/auth/v1/token?grant_type=password", body = body, add_headers(headers))

# get access token from json
access_token <- content(res, "parsed")$access_token

# output access token
print(access_token)
```

:::

## Request data

Request data from table TEMPLATE with access token and apikey.

::: code-group

```R-vue
# Request Data from table TEMPLATE
headers = c(
'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w',
'Authorization' = paste("Bearer", access_token, sep = " "),
'Accept-Profile' = 'fuk',
'Content-Type' = 'text/csv'
)

res <- VERB("GET", url = "http://116.203.31.116:8000/rest/v1/TEMPLATE?select=*", add_headers(headers))

# output data from table TEMPLATE
print(content(res, "text"))
```

:::

## Send data

Send data to table TEMPLATE with access token and apikey.

::: code-group

```R-vue
# create body
body <- '[{"data": "ADDED 1"}, {"data": "ADDED 2"}]'


headers = c(
'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w',
'Authorization' = paste("Bearer", access_token, sep = " "),
'Content-Profile' = 'fuk',
'Content-Type' = 'application/json'
)

res <- VERB("POST", url = "http://116.203.31.116:8000/rest/v1/TEMPLATE", body=body, add_headers(headers))

# output json response
print(content(res, "parsed"))
```
:::