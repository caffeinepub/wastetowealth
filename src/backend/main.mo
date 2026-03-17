import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";

actor {
  // Persistent state for authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type WasteType = {
    #plastic;
    #paper;
    #metal;
    #glass;
    #organic;
    #electronic;
  };

  type WasteSubmission = {
    user : Principal;
    wasteType : WasteType;
    quantityKg : Nat;
    pointsAwarded : Nat;
    aiVerified : Bool;
    timestamp : Time.Time;
  };

  module WasteSubmission {
    public func compare(a : WasteSubmission, b : WasteSubmission) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  type RedemptionType = {
    #money;
    #coupon : Text;
  };

  type Redemption = {
    user : Principal;
    pointsRedeemed : Nat;
    redemptionType : RedemptionType;
    timestamp : Time.Time;
  };

  module Redemption {
    public func compare(a : Redemption, b : Redemption) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  // Motoko 2024 does not support sum type to Text conversions yet

  // Rows with waste type and their points per kg
  // pointsPerKg = currency * 100, to avoid floats
  let wasteTypes : [(WasteType, Nat)] = [
    (#plastic, 150),
    (#paper, 100),
    (#metal, 200),
    (#glass, 120),
    (#organic, 80),
    (#electronic, 250),
  ];

  let wasteSubmissions = Map.empty<Principal, [WasteSubmission]>();
  let redemptions = Map.empty<Principal, [Redemption]>();
  var totalWasteKg = 0;
  var totalPointsAwarded = 0;

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Waste submission
  public shared ({ caller }) func submitWaste(wasteType : WasteType, quantityKg : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit waste");
    };
    // Verify with AI outcall (simplified)
    let _ = await OutCall.httpGetRequest("https://example.com/ai-verify", [], transform);
    let pointsPerKg = switch (wasteTypes.find(func((t, _)) { t == wasteType })) {
      case (null) { Runtime.trap("Invalid waste type") };
      case (?(_, p)) { p };
    };
    let pointsAwarded = quantityKg * pointsPerKg;
    let submission : WasteSubmission = {
      user = caller;
      wasteType;
      quantityKg;
      pointsAwarded;
      aiVerified = true;
      timestamp = Time.now();
    };
    let existingSubmissions = switch (wasteSubmissions.get(caller)) {
      case (null) { [] };
      case (?subs) { subs };
    };
    wasteSubmissions.add(caller, existingSubmissions.concat([submission]));
    totalWasteKg += quantityKg;
    totalPointsAwarded += pointsAwarded;
  };

  // Points redemption
  public shared ({ caller }) func redeemPoints(points : Nat, redemptionType : RedemptionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem points");
    };
    let userPoints = await getUserPoints(caller);
    if (points > userPoints) {
      Runtime.trap("Not enough points");
    };
    let redemption : Redemption = {
      user = caller;
      pointsRedeemed = points;
      redemptionType;
      timestamp = Time.now();
    };
    let existingRedemptions = switch (redemptions.get(caller)) {
      case (null) { [] };
      case (?reds) { reds };
    };
    redemptions.add(caller, existingRedemptions.concat([redemption]));
  };

  // Get user points
  public query ({ caller }) func getUserPoints(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own points");
    };
    let submissions = switch (wasteSubmissions.get(user)) {
      case (null) { [] };
      case (?subs) { subs };
    };
    let redemps = switch (redemptions.get(user)) {
      case (null) { [] };
      case (?reds) { reds };
    };
    let totalPoints = submissions.foldLeft(0, func(acc, s) { acc + s.pointsAwarded });
    let usedPoints = redemps.foldLeft(0, func(acc, r) { acc + r.pointsRedeemed });
    totalPoints - usedPoints;
  };

  // Get user history
  public query ({ caller }) func getUserHistory(user : Principal) : async {
    submissions : [WasteSubmission];
    redemptions : [Redemption];
  } {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own history");
    };
    {
      submissions = switch (wasteSubmissions.get(user)) {
        case (null) { [] };
        case (?subs) { subs.sort() };
      };
      redemptions = switch (redemptions.get(user)) {
        case (null) { [] };
        case (?reds) { reds.sort() };
      };
    };
  };

  // Get platform stats
  public query ({ caller }) func getPlatformStats() : async {
    totalWasteKg : Nat;
    totalPointsAwarded : Nat;
  } {
    {
      totalWasteKg;
      totalPointsAwarded;
    };
  };
};
