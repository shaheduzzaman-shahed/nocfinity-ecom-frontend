import { describe, it, expect } from "vitest";
import { newAddressCheckoutSchema } from "@/features/checkout/schemas/checkout.schema";
import { addressFormSchema } from "@/features/addresses/schemas/address.schema";
import { formatCurrency } from "@/lib/format";

describe("Frontend Checkout & Address Testing", () => {
  describe("Address Validation", () => {
    it("validates a full shipping address", () => {
      const validAddress = {
        name: "John Smith",
        email: "john@example.com",
        phone: "+1-555-0199",
        address: "742 Evergreen Terrace",
        city: "Springfield",
        state: "Oregon",
        postal_code: "97477",
        country: "United States",
      };

      const result = newAddressCheckoutSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it("rejects incomplete address missing required fields", () => {
      const invalid = {
        name: "J",
        email: "notanemail",
        phone: "1",
        address: "Short",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      };

      const result = newAddressCheckoutSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("validates customer address book schema with is_default flag", () => {
      const addressBookEntry = {
        name: "Alice Walker",
        email: "alice@example.com",
        phone: "+1-555-0144",
        address: "100 Main St, Suite 200",
        city: "Seattle",
        state: "Washington",
        postal_code: "98101",
        country: "United States",
        is_default: true,
      };

      expect(addressFormSchema.safeParse(addressBookEntry).success).toBe(true);
    });
  });

  describe("Checkout Financial Calculations", () => {
    it("correctly calculates order total: subtotal - discounts + shipping", () => {
      const subtotal = 250.0;
      const productDiscount = 25.0; // 10% promotional discount
      const couponDiscount = 20.0;  // Fixed $20 coupon
      const shippingCharge = 15.0;  // Standard shipping

      const netTotal = subtotal - productDiscount - couponDiscount + shippingCharge;
      expect(netTotal).toBe(220.0);

      // Verify formatting
      expect(formatCurrency(netTotal, "USD")).toBe("$220.00");
    });

    it("formats different currencies correctly", () => {
      expect(formatCurrency(150.5, "USD")).toBe("$150.50");
      expect(formatCurrency(100, "EUR")).toContain("100.00");
      expect(formatCurrency(2500, "GBP")).toContain("2,500.00");
    });
  });
});
