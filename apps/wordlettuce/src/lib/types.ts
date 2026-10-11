export type NavLinkProps = {
  path: string;
  name: string;
  enabled: boolean;
  prefetch: boolean;
  margin?: string;
  icon?: string;
};

export type GameResult = {
  gameNum: number;
  attempts: number;
  answers: string;
  userID: number;
  score: number;
};

export type Session =
  | {
      authenticated: true;
      user: {
        username: string;
        userID: number;
      };
    }
  | {
      authenticated: false;
    };
