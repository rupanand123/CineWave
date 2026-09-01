export type PersonaType = 'Customer' | 'BookingStaff' | 'AdminLSA';

export type ShowType = 'IMAX' | '4DX' | 'VIP' | 'Standard' | '2D';

export type CaseStatus = 
  | 'New'
  | 'Pending-Availability'
  | 'Pending-CustomerApproval'
  | 'Pending-Execution'
  | 'Resolved-Completed'
  | 'Resolved-Rejected'
  | 'Resolved-Cancelled';

export type PrimaryStageId = 'Initial' | 'Availability' | 'Approval' | 'BookingExecution';
export type AlternateStageId = 'SeatUnavailability' | 'CustomerRejection' | 'CustomerCancellation';
export type StageId = PrimaryStageId | AlternateStageId;

export interface MovieData {
  MovieID: string;
  Title: string;
  Genre: string;
  DurationMinutes: number;
  Rating: string;
  Language: string;
  PosterUrl: string;
  Description: string;
  Director: string;
  Cast: string[];
}

export interface ShowData {
  ShowID: string;
  MovieID: string;
  TheatreName: string;
  City: string;
  Auditorium: string;
  ShowType: ShowType;
  ShowDateTime: string;
  TicketPrice: number;
  TotalSeats: number;
  AvailableSeatsCount: number;
  Rows: number;
  Cols: number;
  OccupiedSeatCodes: string[];
}

export interface CustomerInfo {
  CustomerID: string;
  CustomerName: string;
  CustomerEmail: string;
  CustomerPhone: string;
  LoyaltyTier?: 'Silver' | 'Gold' | 'Platinum' | 'Standard';
}

export interface SeatSelection {
  seatCode: string; // e.g. "C4", "C5"
  row: string;
  number: number;
  seatType: 'Standard' | 'Recliner' | 'VIP';
}

export interface MovieTicketRequestCase {
  pyID: string; // e.g. "MTR-1042"
  pxCreateDateTime: string;
  pxUpdateDateTime: string;
  pxCreateOpName: string;
  pyStatusWork: CaseStatus;
  pyStage: StageId;
  pyCurrentStep: string;
  
  // Case Data Model
  CustomerInfo: CustomerInfo;
  SelectedMovie: MovieData;
  SelectedShow: ShowData;
  NumberOfTickets: number;
  TotalCost: number; // Calculated via Declare Expression: TicketPrice * NumberOfTickets
  SelectedSeats: string[]; // Assigned seat codes e.g. ["D4", "D5"]
  SpecialRequests?: string;
  
  // Workflow & Assignment Routing
  AssignedWorkQueue: 'PremiumShowQueue@CineWave' | 'StandardShowQueue@CineWave' | 'DirectWorklist' | 'None';
  CurrentAssignee?: string;
  
  // SLA Tracking
  SLAGoalTime: string; // 1 day
  SLADeadlineTime: string; // 2 days
  CaseUrgency: number; // Base 10, increments on Goal (+10) and Deadline (+20)
  SLAGoalPassed: boolean;
  SLADeadlinePassed: boolean;
  
  // Booking confirmation tokens
  ConfirmationCode?: string;
  BookingTimestamp?: string;
  EmailSent: boolean;
  EmailSubject?: string;
  EmailBodyPreview?: string;
  AuditTrail: CaseAuditEntry[];
}

export interface CaseAuditEntry {
  timestamp: string;
  stage: string;
  action: string;
  operator: string;
  status: string;
  details: string;
}

export interface WorkQueueItem {
  pyID: string;
  customerName: string;
  movieTitle: string;
  showType: ShowType;
  theatreName: string;
  showTime: string;
  ticketCount: number;
  totalCost: number;
  status: CaseStatus;
  urgency: number;
  queueName: 'PremiumShowQueue@CineWave' | 'StandardShowQueue@CineWave';
  createdAt: string;
}

export interface OperatorProfile {
  OperatorID: string;
  FullName: string;
  Email: string;
  AccessGroup: string;
  AccessRoles: string[];
  WorkGroup: string;
  WorkQueues: string[];
  Persona: PersonaType;
  DefaultPortal: string;
  Skills: { [key: string]: number };
}

export interface DecisionTableRule {
  ruleName: string;
  appliesTo: string;
  purpose: string;
  conditions: {
    columnLabel: string;
    propertyName: string;
    comparator: string;
  }[];
  actions: {
    columnLabel: string;
    targetProperty: string;
  }[];
  rows: {
    id: number;
    conditions: string[];
    returnQueue: string;
    description: string;
  }[];
}

export interface DeclareExpressionRule {
  targetProperty: string;
  appliesToClass: string;
  expression: string;
  calculationType: 'Calculate value whenever inputs change' | 'Calculate when used';
  changeTrackingProperties: string[];
  description: string;
  contextNotes: string;
}

export interface SLARule {
  ruleName: string;
  appliesToClass: string;
  initialUrgency: number;
  goal: {
    interval: string;
    urgencyIncrement: number;
    escalationActivity: string;
  };
  deadline: {
    interval: string;
    urgencyIncrement: number;
    escalationActivity: string;
  };
  passedDeadline: {
    interval: string;
    urgencyIncrement: number;
    escalationActivity: string;
  };
}

export interface CorrespondenceRule {
  ruleName: string;
  appliesToClass: string;
  corrType: 'Email';
  subjectStream: string;
  htmlStream: string;
  tokensUsed: string[];
}
