export interface TokenResponse {
    authorization: {
        username?: string;
        roles: string[];
    };
    authentication: {
        access_token: string;
        token_type: string;
    };
}
