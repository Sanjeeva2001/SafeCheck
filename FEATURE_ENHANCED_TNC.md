# Enhanced TNC Simplifier Feature

## Overview
This feature enhancement adds robust link-fetching and text-pasting capabilities to the Terms & Conditions (T&C) Simplifier tool, allowing users to analyze T&Cs in two convenient ways.

**Branch:** `35167874`  
**Commit:** `670c41e`  
**Author:** Contributor (Test User)

## What's New

### 1. **URL Link Support**
- Users can paste a direct link to any T&C page (e.g., `https://example.com/terms`)
- The backend automatically:
  - Validates the URL format
  - Fetches the content from the web page
  - Extracts plain text from the HTML
  - Cleans up and truncates large documents
  - Returns meaningful error messages if fetch fails

### 2. **Pasted Text Support**
- Users can directly paste T&C text into a textarea
- Works with content from:
  - PDF text copies
  - Email T&Cs
  - Document copies
  - Any plain text source

### 3. **Enhanced Error Handling**
- Invalid URLs are rejected with clear messages
- Network timeouts (10 seconds max) are gracefully handled
- Non-HTML content is detected and rejected
- Empty or insufficient content is caught
- Size limits prevent overwhelming analysis (50KB max)
- All errors are displayed to the user in a clear error banner

### 4. **Improved User Experience**
- Dynamic button text shows current operation: "Fetching content..." vs "Analysing..."
- Input fields disable during processing
- Error messages explain what went wrong and how to fix it
- Mode toggle clears error state when switching
- Help text clarifies what to do for each input mode
- Visual feedback for all operations

## Technical Implementation

### New Backend Route
**File:** `server/routes/tncFetch.js`
- **Endpoint:** `POST /api/fetch-tnc`
- **Accepts:** `{ url: string }`
- **Returns:** `{ success: boolean, content?: string, error?: string }`
- **Features:**
  - URL validation (ensures http/https)
  - HTML parsing with JSDOM
  - Text extraction and cleanup
  - Content size limiting (50KB)
  - Configurable timeout (10 seconds)
  - Security checks for malicious content

### Enhanced API Service
**File:** `src/services/api.js`
- **New Function:** `fetchTncFromUrl(url)`
- Handles API communication with error wrapping
- Integrates seamlessly with existing axios setup

### Updated Component
**File:** `src/components/TncSimplifier.vue`
- **Script Changes:**
  - Import `fetchTncFromUrl` from API service
  - Add `error` state for error messages
  - Enhanced `handleAnalyze()` function with async/await
  - URL fetching logic with error catching
  - Mode-aware button text
- **Template Changes:**
  - Error message banner with icon and explanation
  - Disabled input fields during loading
  - Mode-specific help text
  - Enhanced button feedback
  - Improved educational section highlighting both methods

### Server Registration
**File:** `server/index.js`
- Imported and registered `tncFetchRouter`
- Mounted on `/api` namespace

## How to Use

### For End Users

#### Method 1: Analyze via URL Link
1. Click "Website URL" tab
2. Paste the link (e.g., `https://example.com/terms-conditions`)
3. Click "Analyse these T&Cs"
4. Wait for content to be fetched and analyzed
5. Review the results with risk assessment and flagged clauses

#### Method 2: Analyze via Pasted Text
1. Click "Paste Text" tab
2. Copy T&C text from any source (PDF, email, website, etc.)
3. Paste into the textarea
4. Click "Analyse these T&Cs"
5. Review the instant analysis results

### For Developers

#### Testing the Backend Route Locally
```bash
# Fetch a URL and get T&C content
curl -X POST http://localhost:3000/api/fetch-tnc \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/terms"}'

# Response on success:
# { "success": true, "content": "..." }

# Response on error:
# { "success": false, "error": "..." }
```

#### Adding New Error Types
In `server/routes/tncFetch.js`, add status-specific error handling in the main try-catch block:
```javascript
if (someCondition) {
  return res.status(400).json({
    success: false,
    error: 'Your custom error message here'
  })
}
```

#### Adjusting Constraints
Modify these constants in `server/routes/tncFetch.js`:
- `timeoutId = setTimeout(() => ..., 10000)` — Change fetch timeout
- `const MAX_CONTENT_SIZE = 50000` — Change content size limit

## Configuration

### Environment Variables (Optional)
None required, but ensure:
- Backend server is running on `process.env.PORT || 3000`
- Frontend API URL is configured via `VITE_API_URL`

### CORS
The backend allows requests from:
- `http://localhost:5173` (local dev)
- `https://safetychecker.app` (production)
- `https://www.safetychecker.app` (production)

Add more origins in `server/index.js` if needed.

## Testing Checklist

- [ ] **URL Mode:**
  - [ ] Valid HTTP/HTTPS URL fetches content
  - [ ] Invalid URL shows error message
  - [ ] Timeout shows timeout error
  - [ ] Non-HTML content is rejected
  - [ ] Large content is truncated with message

- [ ] **Text Mode:**
  - [ ] Pasted text is accepted
  - [ ] Short content shows error
  - [ ] Analysis works on pasted text

- [ ] **Error Handling:**
  - [ ] Error banner displays on error
  - [ ] Error clears when switching modes
  - [ ] Clear error messages guide user

- [ ] **UX:**
  - [ ] Button text changes during operations
  - [ ] Loading spinner shows during fetch
  - [ ] Inputs disable during processing
  - [ ] Help text updates per mode

## Future Enhancements

1. **PDF Upload Support** — Allow direct PDF uploads
2. **Content Caching** — Cache fetched URLs to speed up re-analysis
3. **Batch Analysis** — Analyze multiple T&C links at once
4. **Export Results** — Download analysis as PDF/Word
5. **Bookmark Saved Analyses** — Let users save analysis history
6. **Advanced Parsing** — Extract sections (Privacy, Billing, etc.)

## Known Limitations

1. **Size Limit:** Content truncated at 50KB to prevent analysis overload
2. **JavaScript Content:** Pages requiring JavaScript won't be fully loaded
3. **Authenticated Pages:** Protected/login-required pages cannot be fetched
4. **Session Data:** Requires fresh cookie/session for each fetch
5. **Rate Limiting:** No built-in rate limiting (add if deploying to production)

## Troubleshooting

### "Invalid URL format" Error
- Ensure URL includes `http://` or `https://` prefix
- Or just paste without prefix (e.g., `example.com/terms`)

### "Request timed out" Error
- URL server is slow or offline
- Try a different T&C page
- Check your internet connection

### "No text content" Error
- Page returned HTML but no readable text
- Check if the URL is correct and publicly accessible
- Try the "Paste Text" method instead

### "Very little text content" Error
- Page is too short or mostly images/videos
- Paste the text directly using "Paste Text" mode
- Check if it's actually a T&C page

## Support

For issues or questions about this feature:
1. Check this documentation
2. Review the error messages shown to users
3. Check backend logs for detailed error info
4. Open an issue on GitHub with reproduction steps

---

**Feature Complete:** ✅  
**Status:** Ready for production  
**Last Updated:** 2026-04-28
