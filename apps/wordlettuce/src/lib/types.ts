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
