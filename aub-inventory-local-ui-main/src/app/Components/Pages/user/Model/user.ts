
export interface user {
    username: string;

    role: string;
  }

  export interface AUBUsersResponse
  {

    users:user[];
    count :number;
  }
