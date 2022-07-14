import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  
};

beforeEach(()=>{
    const app = initializeApp(firebaseConfig);
});

describe('Firebase', ()=>{
    it('Auth', ()=> {
        const auth = getAuth();
        auth.languageCode = firebase.auth().useDeviceLanguage();
        const recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                signInWithPhoneNumber(auth, "9716008317", recaptchaVerifier)
                    .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                        
                    // ...
                    }).catch((error) => {
                    // Error; SMS not sent
                    // ...
                    });
            }
          }, auth);
    });
});