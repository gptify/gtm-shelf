-- Migration: Relax verified_at publish constraint
-- Description: Drop the constraint that blocks publishing if verified_at or source_urls are missing.

alter table if exists tools drop constraint if exists published_needs_verification;
