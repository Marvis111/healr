# Doctor Public Profile

## URL Structure

The doctor public profile is accessible at:
```
/doctor/{doctor-username}/profile
```

For example:
```
https://healr.ng/doctor/johndoe/profile
```

## How It Works

1. **URL Routing**: The `.htaccess` file routes all `/doctor/{username}/profile` requests to `/doctor/profile.html`
2. **Dynamic Username Extraction**: JavaScript in `profile.html` extracts the doctor username from the URL path
3. **API Integration**: The username is used to fetch doctor data from the API endpoint: `/api/v1/doctors/@{username}/`

## Implementation

The `profile.html` file contains:
- Complete doctor profile UI matching the React component design
- JavaScript that extracts the doctor UID from the URL
- Placeholder for API integration (search for `TODO` comments)
- Report doctor functionality with modal
- Reviews pagination
- Booking consultation redirect

## Next Steps

The API is already integrated! The page now:
- Fetches doctor data from `https://api.healr.ng/api/v1/doctors/@{username}/`
- Transforms the API response to display all profile information
- Handles loading states and errors gracefully

To customize further:
1. Update `API_BASE_URL` if your API is hosted elsewhere
2. Add reviews endpoint integration when available
3. Add consultation fee and availability from API data

## Features

- ✅ Clean URL structure
- ✅ SEO-friendly with meta tags
- ✅ Responsive design
- ✅ Reviews pagination
- ✅ Report doctor modal
- ✅ Book consultation redirect
- ✅ Verified badge
- ✅ Education, certifications, and awards sections
- ✅ Hospital affiliation
- ✅ Star ratings
