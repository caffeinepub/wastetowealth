import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface WasteSubmission {
    pointsAwarded: bigint;
    wasteType: WasteType;
    aiVerified: boolean;
    user: Principal;
    timestamp: Time;
    quantityKg: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Redemption {
    user: Principal;
    timestamp: Time;
    pointsRedeemed: bigint;
    redemptionType: RedemptionType;
}
export type RedemptionType = {
    __kind__: "money";
    money: null;
} | {
    __kind__: "coupon";
    coupon: string;
};
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WasteType {
    metal = "metal",
    organic = "organic",
    plastic = "plastic",
    glass = "glass",
    paper = "paper",
    electronic = "electronic"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getPlatformStats(): Promise<{
        totalWasteKg: bigint;
        totalPointsAwarded: bigint;
    }>;
    getUserHistory(user: Principal): Promise<{
        submissions: Array<WasteSubmission>;
        redemptions: Array<Redemption>;
    }>;
    getUserPoints(user: Principal): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    redeemPoints(points: bigint, redemptionType: RedemptionType): Promise<void>;
    submitWaste(wasteType: WasteType, quantityKg: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
