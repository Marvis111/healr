function handleContinueAsDoctorClick() {
    // if referral code is present in the URL, we are going to redirect to the signup page of the doctor appDownload
    const referralCode = window.location.search.split('referral_code=')[1];
    console.log('Referral code:', referralCode);

    if (referralCode) {
        window.location.href = 'https://doctor.healr.ng/signup?referral_code=' + referralCode;
    } else {
        window.location.href = 'https://doctor.healr.ng/login';
    }
}