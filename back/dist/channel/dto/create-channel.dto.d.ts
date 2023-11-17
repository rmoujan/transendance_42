export declare class CreateChannelDto {
    readonly name: string;
    readonly visibility: string;
    readonly password?: string;
}
export declare class CreateMemberDto {
    readonly id_channel: number;
    readonly name: string;
    readonly visibility: string;
    readonly password?: string | null;
}
export declare class joinDto {
    readonly sendData: CreateMemberDto;
}
export declare class CreateDmDto {
    id_dm: number;
    senderId: number;
    receiverId: number;
    unread: number;
    pinned: Boolean;
}
