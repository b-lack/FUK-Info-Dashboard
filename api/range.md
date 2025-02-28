<script setup>
  let apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w';
  apikey = "[apikey]";
  let endpoint = "http://116.203.31.116:8000/rest/v1/";
</script>

# Range by Date

In this use case, we request data from the `cc_trc` table `Visual Assessment of Crown Condition`. The data is filtered by the `date_survey` column. The `date_survey` column is a `date` type that represents the date (`YYYY-MM-DD`) of the observation.

### Request Dictionary

::: code-group

```R-vue
    library(httr)

    headers = c(
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w',
    'Accept-Profile' = 'icp_dictionaries'
    )

    d_defoliation <- VERB("GET", url = "http://116.203.31.116:8000/rest/v1/d_defoliation", add_headers(headers))
```

```CSV-vue [Response]
    code,description,valid_from_survey_year,valid_to_survey_year
    -1,"No assessment",1984,
    5,>0-5%,1984,
    10,>5-10%,1984,
    15,>10-15%,1984,
    20,>15-20%,1984,
    25,>20-25%,1984,
    30,>25-30%,1984,
    35,>30-35%,1984,
    40,>35-40%,1984,
    45,>40-45%,1984,
    50,>45-50%,1984,
    55,>50-55%,1984,
    60,>55-60%,1984,
    65,>60-65%,1984,
    70,>65-70%,1984,
    75,>70-75%,1984,
    80,>75-80%,1984,
    85,>80-85%,1984,
    90,>85-90%,1984,
    95,>90-95%,1984,
    99,">95-100% (alive)",1984,
    100,"100% (standing dead)",1984,
    0,0%,1984,
 ```

:::

### Request Data

Request data between `2010-1-1` and `2011-1-1` by filtering the `date_survey` column in the `cc_trc` table. For filtering, we use the `gt` (greater than) and `lt` (less than) operators.

`and=(date_survey.gt.2010-1-1,date_survey.lt.2011-1-1)`

`select=date_survey,code_tree_species,code_defoliation`

[more Operators](https://docs.postgrest.org/en/v12/references/api/tables_views.html)

::: code-group

```R-vue
    library(httr)

    headers = c(
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzM4Nzk2NDAwLAogICJleHAiOiAxODk2NTYyODAwCn0.qnofsORUSwCd9Whx3XFbR56-k_ydI5DLDnV2AKxV37w',
    'Accept-Profile' = 'icp_download'
    )

    cc_trc <- VERB("GET", url = "http://116.203.31.116:8000/rest/v1/cc_trc?and=(date_survey.gt.2010-1-1,date_survey.lt.2011-1-1)&select=date_survey,code_tree_species,code_defoliation", add_headers(headers))
```

```json-vue [Response]
[
    {
        "date_survey": "2010-06-30",
        "code_tree_species": 134,
        "code_defoliation": 15
    },
    {
        "date_survey": "2010-06-30",
        "code_tree_species": 134,
        "code_defoliation": 15
    },
    {
        "date_survey": "2010-06-30",
        "code_tree_species": 134,
        "code_defoliation": 25
    },
    {...}
]
````

:::