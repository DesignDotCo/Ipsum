app.service('googleService',  ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

    var OAUTH2_CLIENT_ID = '869186551788-dl1e776vm53rg83r9la0il5jhlohos3l.apps.googleusercontent.com';
    var OAUTH2_SCOPES    = [
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email'
    ]; 
    var APIKEY = "AIzaSyDjOnP0jHZLkkpAIx-tdAi1JVvNDX2BbZI";

    var ONE_MONTH_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30;
    var YOUTUBE_USER              = {};
    var ANALYTICS                 = 0;
    var CHANNEL_ID;
    var deferred                  = $q.defer();

    // Upon loading, the Google APIs JS client automatically invokes this callback.
    this.handleClientLoad = function () {
        gapi.client.setApiKey(APIKEY);
        gapi.auth.init(function() {
            window.setTimeout(this.checkAuth, 1);
        });
    };

    // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
    // If the currently logged-in Google Account has previously authorized
    // the client specified as the OAUTH2_CLIENT_ID, then the authorization
    // succeeds with no user intervention. Otherwise, it fails and the
    // user interface that prompts for authorization needs to display.
   this.checkAuth = function () {
        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: true
      }, this.handleAuthResult);
    };

   // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
   this.login = function () {
        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: false
      }, this.handleAuthResult);
    };

    // Handle the result of a gapi.auth.authorize() call.
    this.handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            // Authorization was successful. Hide authorization prompts and show
            // content that should be visible after authorization succeeds.
            //console.log("successful");
            loadAPIClientInterfaces();         
        } else {
            this.login();
        }
        return deferred.promise;
    };
    

    // Load the client interfaces for the YouTube Analytics and Data APIs, which
    // are required to use the Google APIs JS client. More info is available at
    // http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
    function loadAPIClientInterfaces () {
        gapi.client.load('youtube', 'v3', function() {
            gapi.client.load('youtubeAnalytics', 'v1', function() {
                gapi.client.load('plus', 'v1', function() {  
                    //console.log('loaded.');
                    var youtuebeId, youtubeName, youtubeView;
                    handleAPILoaded();
                });
            });
        });
    };

    // After the API loads.
    function handleAPILoaded () {
        requestUserStatistics();
    };

    function requestUserStatistics () {
        // See https://developers.google.com/youtube/v3/docs/channels/list
        var request = gapi.client.youtube.channels.list({
            mine: true,
            part: 'snippet, statistics'
        });
        request.execute(function(response) {
            YOUTUBE_USER.id   = response.result.items[0].id;
            YOUTUBE_USER.name = response.result.items[0].snippet.title;
            YOUTUBE_USER.view = response.result.items[0].statistics.viewCount;
            if(response.result.items[0].statistics.hiddenSubscriberCount === false)
                YOUTUBE_USER.subs  = response.result.items[0].statistics.subscriberCount; 
            requestUserAnalytics(YOUTUBE_USER.id);
        });
    };

    function requestUserAnalytics (CHANNEL_ID) {
        if (CHANNEL_ID) {
            // To use a different date range, modify the ONE_MONTH_IN_MILLISECONDS
            // variable to a different millisecond delta as desired.
            var today = new Date();
            var lastMonth = new Date(today.getTime() - ONE_MONTH_IN_MILLISECONDS);
            var request = gapi.client.youtubeAnalytics.reports.query({
                // The start-date and end-date parameters need to be YYYY-MM-DD strings.
                'start-date': formatDateString(lastMonth),
                'end-date': formatDateString(today),
                // A future YouTube Analytics API release should support channel==default.
                // In the meantime, you need to explicitly specify channel==CHANNEL_ID.
                // See https://devsite.googleplex.com/youtube/analytics/v1/#ids
                ids: 'channel==' + CHANNEL_ID,
                dimensions: 'day',
                // See https://developers.google.com/youtube/analytics/v1/available_reports for details
                // on different filters and metrics you can request when dimensions=day.
                metrics: 'views'
            });

            request.execute(function(response) {
                // This function is called regardless of whether the request succeeds.
                // The response either has valid analytics data or an error message.
                if ('error' in response) {
                    console.log(response.error.message);
                } else {
                    //console.log(response.result.rows);
                    if(response.result.rows) {
                        response.result.rows.forEach(function(entry) {
                            ANALYTICS += entry[1];
                        });
                        ANALYTICS = Math.round(ANALYTICS / 30);
                    }
                    YOUTUBE_USER.analytics = ANALYTICS;
                    requestUserPlus();
                    //console.log(YOUTUBE_USER);
                }
            });
        } else {
            console.log('The YouTube user id for the current user is not available.');
        }
    };

    function requestUserPlus () {
        // See https://developers.google.com/+/api/
        var request = gapi.client.plus.people.get({
            userId: 'me',
            fields: 'emails, displayName'
        });
        request.execute(function(response) {
            YOUTUBE_USER.fullName = response.result.displayName;
            YOUTUBE_USER.email    = response.result.emails[0].value;
            deferred.resolve(YOUTUBE_USER);
        });
    };

    // Boilerplate code to take a Date object and return a YYYY-MM-DD string.
    function formatDateString (date) {
        var yyyy = date.getFullYear().toString();
        var mm = padToTwoCharacters(date.getMonth() + 1);
        var dd = padToTwoCharacters(date.getDate());

        return yyyy + '-' + mm + '-' + dd;
    };

    // If number is a single digit, prepend a '0'. Otherwise, return it as a string.
    function padToTwoCharacters (number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number.toString();
        }
    };
}]);
