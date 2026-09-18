-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "action_name_id" TEXT NOT NULL,
    "zap_id" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "sortingOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Available Actions" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,

    CONSTRAINT "Available Actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Available Triggers" (
    "id" TEXT NOT NULL,
    "trigger_name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Available Triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "trigger_id" TEXT,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap" (
    "id" TEXT NOT NULL,
    "trigger_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "zap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap run" (
    "id" TEXT NOT NULL,
    "zap_id" TEXT,
    "metadata" JSON,

    CONSTRAINT "zap run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zap run outbox" (
    "id" TEXT NOT NULL,
    "zap_run_id" TEXT,

    CONSTRAINT "zap run outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "action_name_id is a fkey" FOREIGN KEY ("action_name_id") REFERENCES "Available Actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "zap_id is a fkey" FOREIGN KEY ("zap_id") REFERENCES "zap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "trigger_id is a fkey" FOREIGN KEY ("trigger_id") REFERENCES "Available Triggers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zap" ADD CONSTRAINT "trigger_id will be a fkey" FOREIGN KEY ("trigger_id") REFERENCES "Trigger"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zap" ADD CONSTRAINT "user_id is a fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zap run" ADD CONSTRAINT "zap_id is a fkey" FOREIGN KEY ("zap_id") REFERENCES "zap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "zap run outbox" ADD CONSTRAINT "zap_run_id is a fkey" FOREIGN KEY ("zap_run_id") REFERENCES "zap run"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
