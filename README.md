# Netflix Activity Extractor

Extract your viewing activity data from Netflix.

## Steps

Before you start, don't forget to install dependencies with `npm install`

1. Go to https://www.netflix.com/WiViewingActivity
2. Make sure you're logged in and can see some activity
3. Open your browser developer tools and open the network monitoring
4. Scroll the Netflix page to the bottom, requesting more data
5. Inspect the network request, you'll be grabbing 3 pieces of data:
   - Build number: `api/shakti/<build_number>/viewingactivity`
   - Secure Netflix Id cookie: `SecureNetflixId` in the `Cookie` header
   - Netflix Id cookie: `NetflixId` in the `Cookie` header
6. Create a `.env` file with those three values, under the variable names
`BUILD_ID`, `SECURE_NETFLIX_ID` and `NETFLIX_ID` respectively
7. Time to get some data - use `npm start` to kick off the script
8. If it's all working, you'll get an `output` directory created with the raw
responses and the viewing activity sliced by day.
