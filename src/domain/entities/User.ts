export class User {
    constructor(
      public id: string,
      public email: string,
      public name:string,
      public googleId?: string,
      public password?: string
    ) {}
  }
  