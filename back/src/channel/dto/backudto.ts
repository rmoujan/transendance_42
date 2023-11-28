// import { IsString, Length, IsNotEmpty, IsIn, ValidateIf, IsNumber, IsInt, IsOptional, IsArray } from "class-validator";

// // // that will be the data that Iam expect by the client when creating a new channel.
// // export class CreateChannelDto {
// //     @IsNotEmpty({ message: 'Property must not be empty' })
// //     @Length(5, 15) 
// //     readonly name: string;

// //     @IsNotEmpty({ message: 'Property must not be empty' })
// //     @IsString()
// //     @IsIn(['public', 'private', 'protected'])
// //     readonly visibility:string;

// //     @ValidateIf((o) => o.password !== undefined) 
// //     @Length(5, 15) 
// //     readonly password?:string;
// //   }

// // that will be the data that Iam expect by the client when creating a new channel.
// // export class CreateMemberDto {

// //   @IsNotEmpty({ message: 'Property must not be empty' })
// //   @IsNumber()
// //   readonly id_channel: number;

// //   @IsString()
// //   @IsNotEmpty({ message: 'Property must not be empty' })
// //   readonly name:string;

// //   @IsString()
// //   @IsNotEmpty({ message: 'Property must not be empty' })
// //   readonly visibility:string;

// //   @IsString()
// //   readonly password?:string | null;
// // }

// export class CreateMemberDto {
//   @IsInt()
//   readonly id_channel: number;

//   @IsString()
//   readonly name: string;

//   @IsString()
//   readonly visibility: string;

//   @IsOptional()
//   @IsString()
//   readonly password?: string | null;
// }

// export class CreateDmDto {
//   id_dm : number
//   senderId : number      
//   receiverId : number   
//   unread : number 
//   pinned :Boolean
// }


// export class CreateChannelDto {
//   @IsOptional()
//   @IsString()
//   readonly avatar?: string;

//   @IsOptional()
//   @IsString()
//   readonly passwordConfirm?: string | null;

//   @IsOptional()
//   @IsString()
//   readonly password?: string | null;

//   @IsArray()
//   readonly members: string[];

//   @IsString()
//   readonly title: string;

//   @IsString()
//   readonly type: string;

// }

// // incoming data for creating channels in all types of channel .
// // {
// //   avatar: 'blob:http://localhost:5173/1aec2816-9766-44c7-880a-e680876b5a1d',
// //   passwordConfirm: 'test123',
// //   password: 'test123',
// //   members: [ 'sbensarg', 'shicham' ],
// //   title: 'testpro',
// //   type: 'protected'
// // }

// // {
// //   avatar: 'blob:http://localhost:5173/bd9b2e15-5cb1-4e03-aa42-67da40fa145d',
// //   members: [ 'sbensarg', 'shicham' ],
// //   title: 'testprivate',
// //   type: 'private'
// // }

// // {
// //   title: 'testPublic',
// //   members: [ 'sbensarg', 'shicham' ],
// //   type: 'public'
// // }

// // about joinchannel :

// // {
// //   sendData: { id_channel: 24, name: 'OK', visibility: 'public', password: null }
// // }

// // export class joinDto {
// //   readonly sendData: JoinChannelDto;
// // }

// // export class JoinChannelDto {

// //   @IsInt()
// //   readonly id_channel: number;

// //   @IsString()
// //   readonly name: string;

// //   @IsString()
// //   readonly visibility: string;

// //   @IsOptional()
// //   @IsString()
// //   readonly password?: string | null;
// // }



// export class JoinChannelDto {
//   @IsInt()
//   readonly sendData: {
//     id_channel: number;

//     @IsString()
//     name: string;

//     @IsString()
//     visibility: string;

//     @IsOptional()
//     @IsString()
//     password: string | null;
//   };
// }

