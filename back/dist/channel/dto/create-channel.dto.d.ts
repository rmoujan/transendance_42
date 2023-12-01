export declare class CreateMemberDto {
    readonly id_channel: number;
    readonly name: string;
    readonly visibility: string;
    readonly password?: string | null;
}
export declare class CreateChannelDto {
    readonly avatar?: string;
    readonly passwordConfirm?: string | null;
    readonly password?: string | null;
    readonly members: string[];
    readonly title: string;
    readonly type: string;
}
declare class JoinChannelDataDto {
    id_channel: number;
    name: string;
    visibility: string;
    password: string | null;
}
export declare class JoinChannelDto {
    sendData: JoinChannelDataDto;
}
export {};
