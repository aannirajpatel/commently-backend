# Commently Backend

This repository houses the `Firebase` backend logic for the Commently Web App, usable at https://commently.net (work in progress).

## Technologies Used
`Cloud Firestore`, `Cloud Functions`, `Realtime Database`, `GitHub Actions`

## Contents
1. A cloud function that takes in a site URL and provides site metadata. Used by the React frontend application, [`commently-web-app`](https://github.com/aannirajpatel/commently-web-app), to resolve site metadata on the comments page for a given site. Source code: 
1. Cloud Firestore security rules
1. Realtime Database security rules

## Realtime Database Schema for Page Information

The provided source code is for a Firebase Cloud Function that interacts with the Realtime Database to store and retrieve page information for a web application. The schema for the Realtime Database is outlined below:

## Pages

### Structure

- **Root**
  - **page**
    - **[pageHash]**
      - **canonicalUrl**: The canonical URL of the page.
      - **commentPageId**: A unique identifier pointing to a document in Cloud Firestore that holds all comments for the particular page.
      - *(other page information attributes)*

### Explanation

- The root node of the Realtime Database contains a single key-value pair: "page".
- Under the "page" node, each page has a unique hash-based key denoted as `[pageHash]`. The `[pageHash]` is generated using the `hashed()` function, which is likely a hash of the page URL.
- Each page identified by its `[pageHash]` contains information about the page, including the `canonicalUrl` and `commentPageId`, along with other attributes that are extracted from the page scraping process.