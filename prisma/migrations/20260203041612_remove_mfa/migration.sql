/*
  Warnings:

  - The values [MFA_ENABLED,MFA_DISABLED] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `backupCodes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mfaEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mfaMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mfaSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MFAToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditAction_new" AS ENUM ('LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGED', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_RESTORED', 'ROLE_CHANGED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'PRODUCT_RESTORED', 'PRODUCT_STOCK_UPDATED', 'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_STATUS_CHANGED', 'ORDER_CANCELLED', 'DATA_EXPORTED');
ALTER TABLE "AuditLog" ALTER COLUMN "action" TYPE "AuditAction_new" USING ("action"::text::"AuditAction_new");
ALTER TYPE "AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "AuditAction_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "MFAToken" DROP CONSTRAINT "MFAToken_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "backupCodes",
DROP COLUMN "mfaEnabled",
DROP COLUMN "mfaMethod",
DROP COLUMN "mfaSecret";

-- DropTable
DROP TABLE "MFAToken";

-- DropEnum
DROP TYPE "MFAMethod";
