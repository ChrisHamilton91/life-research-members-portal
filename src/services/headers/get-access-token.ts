import { msalInstance, scopes } from "../../../auth-config";
import { en } from "../context/language-ctx";
import Notification from "../notifications/notification";

// See https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/token-lifetimes.md

export default async function getAccessToken(): Promise<string | null> {
  const account = msalInstance.getActiveAccount();
  if (!account) return null;
  return msalInstance
    .acquireTokenSilent({ scopes, account })
    .then((res) => res.accessToken)
    .catch((e: any) => {
      // Just assume any error means session has expired
      new Notification().error(
        en
          ? "Your session has expired, please login again."
          : "Votre session a expiré, veuillez vous reconnecter."
      );
      msalInstance.setActiveAccount(null);
      return null;
    });
}
