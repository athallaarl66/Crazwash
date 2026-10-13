import "next-auth";
import "next-auth/jwt";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    email: string | null;
    name: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
