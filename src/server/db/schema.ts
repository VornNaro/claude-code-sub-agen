import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  pgEnum,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "available",
  "reserved",
  "sold",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const bodyTypeEnum = pgEnum("body_type", [
  "sedan",
  "suv",
  "hatchback",
  "electric",
  "hybrid",
  "truck",
  "van",
]);

// Categories
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vehicles
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  categoryId: uuid("category_id").references(() => categories.id),
  bodyType: bodyTypeEnum("body_type").notNull(),
  year: integer("year").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  msrp: decimal("msrp", { precision: 12, scale: 2 }),
  mileage: integer("mileage").default(0),
  fuelType: varchar("fuel_type", { length: 50 }),
  transmission: varchar("transmission", { length: 50 }),
  engineSize: varchar("engine_size", { length: 50 }),
  horsepower: integer("horsepower"),
  seatingCapacity: integer("seating_capacity"),
  drivetrain: varchar("drivetrain", { length: 50 }),
  exteriorColor: varchar("exterior_color", { length: 50 }),
  interiorColor: varchar("interior_color", { length: 50 }),
  vin: varchar("vin", { length: 17 }).unique(),
  status: vehicleStatusEnum("status").default("available").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(true),
  specs: jsonb("specs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vehicle Images
export const vehicleImages = pgTable("vehicle_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 200 }),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
});

// Vehicle Features
export const vehicleFeatures = pgTable("vehicle_features", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
});

// User Profiles (synced from Clerk)
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 200 }).notNull().unique(),
  email: varchar("email", { length: 200 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cart Items
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => userProfiles.id, { onDelete: "cascade" })
    .notNull(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => userProfiles.id)
    .notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 200 }),
  shippingAddress: jsonb("shipping_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => userProfiles.id)
    .notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }),
  content: text("content"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wishlist
export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => userProfiles.id, { onDelete: "cascade" })
    .notNull(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  vehicles: many(vehicles),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  category: one(categories, {
    fields: [vehicles.categoryId],
    references: [categories.id],
  }),
  images: many(vehicleImages),
  features: many(vehicleFeatures),
  reviews: many(reviews),
}));

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleImages.vehicleId],
    references: [vehicles.id],
  }),
}));

export const vehicleFeaturesRelations = relations(
  vehicleFeatures,
  ({ one }) => ({
    vehicle: one(vehicles, {
      fields: [vehicleFeatures.vehicleId],
      references: [vehicles.id],
    }),
  }),
);

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  cartItems: many(cartItems),
  orders: many(orders),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(userProfiles, {
    fields: [cartItems.userId],
    references: [userProfiles.id],
  }),
  vehicle: one(vehicles, {
    fields: [cartItems.vehicleId],
    references: [vehicles.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(userProfiles, {
    fields: [orders.userId],
    references: [userProfiles.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  vehicle: one(vehicles, {
    fields: [orderItems.vehicleId],
    references: [vehicles.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [reviews.vehicleId],
    references: [vehicles.id],
  }),
  user: one(userProfiles, {
    fields: [reviews.userId],
    references: [userProfiles.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(userProfiles, {
    fields: [wishlistItems.userId],
    references: [userProfiles.id],
  }),
  vehicle: one(vehicles, {
    fields: [wishlistItems.vehicleId],
    references: [vehicles.id],
  }),
}));
