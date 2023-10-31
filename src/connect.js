import { useEffect } from 'react';
import passportInstance from './config.js'

export default function Connect() {
  useEffect(() => {
      async function handleLoginCallback() {
        console.log(passportInstance);
          if (!passportInstance) {
              return
            }
            try {
                await passportInstance.loginCallback();
                console.log("login callback");
            }catch (err) {
            
                console.error("login callback error", err);
            }
        }
        handleLoginCallback()
    }, []);
    
    return (
        <div>...
    </div>
    )
}
