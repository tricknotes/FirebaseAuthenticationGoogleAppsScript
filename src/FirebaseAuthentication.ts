import { User, UserWithEmail, UserWithPhoneNumber } from './@types';

export * from './@types';

export class FirebaseAuthentication {
  private _accessToken: string;

  static getAuth(email: string, key: string, projectId: string) {
    return new FirebaseAuthentication(email, key, projectId);
  }

  constructor(
    private email: string,
    private key: string,
    private projectId: string,
  ) {}

  public getUserByUid(uid: string): User | null {
    const response = this.requestWithAuth('/accounts:lookup', 'post', {
      localId: [uid],
    });

    return this.pickUser<User>(response.users);
  }

  public getUserByLocalId(localId: string): User | null {
    // Just alias
    return this.getUserByUid(localId);
  }

  public getUserByEmail(email: string): UserWithEmail | null {
    const response = this.requestWithAuth('/accounts:lookup', 'post', {
      email: [email],
    });

    return this.pickUser<UserWithEmail>(response.users);
  }

  public getUserByPhoneNumber(phoneNumber: string): UserWithPhoneNumber | null {
    const response = this.requestWithAuth('/accounts:lookup', 'post', {
      phoneNumber: [phoneNumber],
    });

    console.log(response.users[0].providerUserInfo);

    return this.pickUser<UserWithPhoneNumber>(response.users);
  }

  public getUsers(maxResults: number = 1000): User[] {
    const response = this.requestWithAuth('/accounts:batchGet', 'get', { maxResults });

    return response.users || [];
  }

  public createUser(params: object): User {
    return this.requestWithAuth('/accounts', 'post', params);
  }

  public createUsers(users: object[]) {
    return this.requestWithAuth('/accounts:batchCreate', 'post', { users })
  }

  public updateUser(params: object): User {
    return this.requestWithAuth('/accounts:update', 'post', params);
  }

  public deleteUser(localId: string) {
    return this.requestWithAuth('/accounts:delete', 'post', { localId });
  }

  public deleteUsers(localIds: string[], force: boolean = false) {
    if (localIds.length === 0) {
      return null;
    }

    return this.requestWithAuth('/accounts:batchDelete', 'post', { localIds, force });
  }

  private pickUser<T>(users: User[]): T | null {
    if (!users || users.length === 0) {
      return null;
    } else {
      return (users[0] as unknown) as T;
    }
  }

  private requestWithAuth(path: string, method: GoogleAppsScript.URL_Fetch.HttpMethod, data?: object) {
    const options = {
      method,
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

    if (data) {
      if (method === 'get') {
        path = `${path}?${Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')}`;
      } else {
        options.payload = JSON.stringify(data);
      }
    }

    const url = `https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}${path}`;
    const response = UrlFetchApp.fetch(url, options);

    return JSON.parse(response.getContentText());
  }

  private get accessToken() {
    // This access token will expire after 1 hour later, but GAS will terminate 30 min for Google limitation.
    // Therefore, we don't care refresh it.
    if (!this._accessToken) {
      this._accessToken = this.getAccessToken();
    }
    return this._accessToken;
  }

  private getAccessToken() {
    const GOOGLE_AUTH_TOKEN_HOST = 'accounts.google.com';
    const GOOGLE_AUTH_TOKEN_PATH = '/o/oauth2/token';

    const token = this.createAuthJwt();
    const postData =
      'grant_type=urn%3Aietf%3Aparams%3Aoauth%3A' +
      'grant-type%3Ajwt-bearer&assertion=' +
      token;
    const url = `https://${GOOGLE_AUTH_TOKEN_HOST}${GOOGLE_AUTH_TOKEN_PATH}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      payload: postData,
    });
    const { access_token } = JSON.parse(response.getContentText());

    return access_token;
  }

  private createAuthJwt() {
    const GOOGLE_TOKEN_AUDIENCE = 'https://accounts.google.com/o/oauth2/token';
    const ONE_HOUR_IN_SECONDS = 60 * 60;

    const scope = [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/firebase.database',
      'https://www.googleapis.com/auth/firebase.messaging',
      'https://www.googleapis.com/auth/identitytoolkit',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');

    const jwtHeader = {
      alg: 'RS256',
    };
    const seconds = ~~(new Date().getTime() / 1000);
    const jwtPayload = {
      iss: this.email,
      scope,
      aud: GOOGLE_TOKEN_AUDIENCE,
      exp: seconds + ONE_HOUR_IN_SECONDS,
      iat: seconds,
    };
    const jwtHeaderBase64 = Utilities.base64EncodeWebSafe(JSON.stringify(jwtHeader));
    const jwtClaimBase64 = Utilities.base64EncodeWebSafe(JSON.stringify(jwtPayload));
    const signatureInput = `${jwtHeaderBase64}.${jwtClaimBase64}`;
    const signature = Utilities.computeRsaSha256Signature(signatureInput, this.key);

    return `${signatureInput}.${Utilities.base64EncodeWebSafe(signature)}`;
  }
}

export function getAuth(email: string, key: string, projectId: string) {
  return FirebaseAuthentication.getAuth(email, key, projectId);
}
