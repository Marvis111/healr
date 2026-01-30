# Doctor Public Profile

## URL Structure

The doctor public profile is accessible at:
```
/doctor/{doctor-uid}/profile
```

For example:
```
https://healr.ng/doctor/6628c7df-8d42-4321-97cb-6f7a03777f43/profile
```

## How It Works

1. **URL Routing**: The `.htaccess` file routes all `/doctor/{uid}/profile` requests to `/doctor/profile.html`
2. **Dynamic UID Extraction**: JavaScript in `profile.html` extracts the doctor UID from the URL path
3. **API Integration**: The UID is used to fetch doctor data from your backend API (currently using static data)

## Implementation

The `profile.html` file contains:
- Complete doctor profile UI matching the React component design
- JavaScript that extracts the doctor UID from the URL
- Placeholder for API integration (search for `TODO` comments)
- Report doctor functionality with modal
- Reviews pagination
- Booking consultation redirect

## Next Steps

To connect to your real API:

1. Find the `TODO` comment in `profile.html` around line 800
2. Replace the static `STATIC_DOCTOR_DATA` with an API call:
   ```javascript
   async function fetchDoctorData(doctorUid) {
       const response = await fetch(`https://api.healr.ng/doctors/${doctorUid}/public-profile`);
       const data = await response.json();
       return data;
   }
   ```
3. Update the initialization to use the fetched data

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
