/**
 * Tests para permissionValidator.js
 * Validador de permisos del bot
 */

const {
  validateTicketPermissions,
  validateModerationPermissions,
  validateVerificationPermissions,
  buildPermissionErrorEmbed,
  PERMISSIONS
} = require("../src/utils/permissionValidator");

// Mock de guild y permisos
const createMockGuild = (permissions = {}) => ({
  id: "123456789",
  name: "Test Guild",
  members: {
    me: {
      permissions: {
        has: (perm) => permissions[perm] !== false
      }
    }
  }
});

describe("permissionValidator", () => {
  describe("validateTicketPermissions", () => {
    it("debería pasar cuando tiene todos los permisos", async () => {
      const guild = createMockGuild({
        [PERMISSIONS.MANAGE_CHANNELS]: true,
        [PERMISSIONS.VIEW_CHANNEL]: true,
        [PERMISSIONS.SEND_MESSAGES]: true,
        [PERMISSIONS.MANAGE_ROLES]: true
      });

      const result = await validateTicketPermissions(guild);

      expect(result.allPassed).toBe(true);
      expect(result.failed).toHaveLength(0);
    });

    it("debería fallar cuando faltan permisos", async () => {
      const guild = createMockGuild({
        [PERMISSIONS.MANAGE_CHANNELS]: false,
        [PERMISSIONS.VIEW_CHANNEL]: true,
        [PERMISSIONS.SEND_MESSAGES]: true,
        [PERMISSIONS.MANAGE_ROLES]: false
      });

      const result = await validateTicketPermissions(guild);

      expect(result.allPassed).toBe(false);
      expect(result.failed.length).toBeGreaterThan(0);
      expect(result.failed).toContain("MANAGE_CHANNELS");
      expect(result.failed).toContain("MANAGE_ROLES");
    });

    it("debería incluir detalles de la operación create", async () => {
      const guild = createMockGuild({});

      const result = await validateTicketPermissions(guild);

      expect(result.details).toHaveProperty("create");
      expect(result.details.create).toHaveProperty("operation");
      expect(result.details.create).toHaveProperty("missing");
    });
  });

  describe("validateModerationPermissions", () => {
    it("debería requerir permisos de moderación", async () => {
      const guild = createMockGuild({
        [PERMISSIONS.KICK_MEMBERS]: true,
        [PERMISSIONS.BAN_MEMBERS]: true,
        [PERMISSIONS.MODERATE_MEMBERS]: true,
        [PERMISSIONS.MANAGE_MESSAGES]: true
      });

      const result = await validateModerationPermissions(guild, "warn");

      expect(result.allPassed).toBe(true);
    });

    it("debería fallar sin permisos de ban", async () => {
      const guild = createMockGuild({
        [PERMISSIONS.KICK_MEMBERS]: true,
        [PERMISSIONS.BAN_MEMBERS]: false,
        [PERMISSIONS.MODERATE_MEMBERS]: true
      });

      const result = await validateModerationPermissions(guild, "ban");

      expect(result.allPassed).toBe(false);
    });
  });

  describe("validateVerificationPermissions", () => {
    it("debería requerir MANAGE_ROLES", async () => {
      const guild = createMockGuild({
        [PERMISSIONS.MANAGE_ROLES]: true
      });

      const result = await validateVerificationPermissions(guild);

      expect(result.allPassed).toBe(true);
    });

    it("debería fallar sin MANAGE_ROLES", async () => {
      const guild = createMockGuild({
        [PERMISSIONS.MANAGE_ROLES]: false
      });

      const result = await validateVerificationPermissions(guild);

      expect(result.allPassed).toBe(false);
      expect(result.failed).toContain("MANAGE_ROLES");
    });
  });

  describe("buildPermissionErrorEmbed", () => {
    it("debería retornar un embed válido", () => {
      const details = {
        operation: "create",
        required: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
        missing: ["MANAGE_CHANNELS"]
      };

      const embed = buildPermissionErrorEmbed(details, "es");

      expect(embed).toBeDefined();
      // El embed debería tener propiedades de EmbedBuilder
      expect(embed.data).toBeDefined();
    });

    it("debería manejar diferentes idiomas", () => {
      const details = {
        operation: "create",
        required: ["MANAGE_CHANNELS"],
        missing: ["MANAGE_CHANNELS"]
      };

      const embedEs = buildPermissionErrorEmbed(details, "es");
      const embedEn = buildPermissionErrorEmbed(details, "en");

      expect(embedEs).toBeDefined();
      expect(embedEn).toBeDefined();
    });
  });
});
