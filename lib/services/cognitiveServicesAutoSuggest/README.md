---
uid: azure-cognitiveservices-autosuggest
summary: *content

---
# Microsoft Azure SDK for Node.js - AutoSuggestAPIClient
This project provides a Node.js package for accessing Azure. Right now it supports:
- **Node.js version 6.x.x or higher**

## Features


## How to Install

```bash
npm install azure-cognitiveservices-autosuggest
```

## How to use

### Authentication, client creation and autoSuggest as an example.

```javascript
const serviceKey = "<service-key>";
const query = "Satya Nadella";
const credentials = new CognitiveServicesCredentials(serviceKey);
const autoSuggestApiClient = new Search.AutoSuggestAPIClient(credentials);

let autoSuggestResults;
try {
  autoSuggestResults = await autoSuggestApiClient.autoSuggest(query);
  console.log("Request autosuggestions for '" + query + "'");
} catch (err) {
  console.log("Encountered exception. " + err.message);
}
if (!autoSuggestResults) {
  console.log("No autosuggest result data. ");
} else {
  // AutoSuggest results
  const suggestionGroups = autoSuggestResults.suggestionGroups;
  if (!suggestionGroups || suggestionGroups.length === 0) {
    console.log("No suggestion groups returned.");
  } else {
    console.log(`Found Suggestion Groups:`);
    let suggestionGroupNumber = 0;
    for (const suggestionGroup of suggestionGroups) {
      console.log(`${++suggestionGroupNumber}: ${suggestionGroup.name}`);
      const searchSuggestions = suggestionGroup.searchSuggestions;
      if (!searchSuggestions || searchSuggestions.length === 0) {
        console.log(`  No suggestions.`);
      } else {
        let searchSuggestionNumber = 0;
        for (const searchSuggestion of searchSuggestions) {
          console.log(`  ${suggestionGroupNumber}.${++searchSuggestionNumber}: ${suggestion.displayText}`);
        }
      }
    }
  }
}
```

## Related projects

- [Microsoft Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)
