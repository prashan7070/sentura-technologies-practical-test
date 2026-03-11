package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/countries")
@CrossOrigin(origins = "*")
public class CountryController {

    private List<Map<String, Object>> cache = new ArrayList<>();
    private long lastFetchTime = 0;

    @GetMapping
    public List<Map<String, Object>> getCountries() {
        refreshCacheIfNeeded();
        return cache;
    }

    @GetMapping("/search")
    public List<Map<String, Object>> search(@RequestParam String query) {
        refreshCacheIfNeeded();
        return cache.stream()
                .filter(c -> ((String)c.get("name")).toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }

    private void refreshCacheIfNeeded() {
        long tenMinutes = 10 * 60 * 1000;
        if (cache.isEmpty() || (System.currentTimeMillis() - lastFetchTime > tenMinutes)) {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags";
            Object[] response = restTemplate.getForObject(url, Object[].class);

            cache = Arrays.stream(response).map(obj -> {
                Map<String, Object> map = (Map<String, Object>) obj;
                Map<String, Object> result = new HashMap<>();
                result.put("name", ((Map)map.get("name")).get("common"));
                result.put("capital", ((List)map.get("capital")).isEmpty() ? "" : ((List)map.get("capital")).get(0));
                result.put("region", map.get("region"));
                result.put("population", map.get("population"));
                result.put("flag", ((Map)map.get("flags")).get("png"));
                return result;
            }).collect(Collectors.toList());

            lastFetchTime = System.currentTimeMillis();
        }
    }
}