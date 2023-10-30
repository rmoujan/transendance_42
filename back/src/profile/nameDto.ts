import { IsNotEmpty,
        IsString,
        Matches, 
        MinLength, 
        MaxLength,
    } from 'class-validator';

export class CreateUserDto {

    @MinLength(3, {message: 'Title is too short',})
    @MaxLength(9, {message: 'Title is too long',})
    @Matches(/^\S+$/, {message: 'Should not contain a space'})
    // @Matches(/0123456789/, {message: 'no number'})
    @IsNotEmpty({message: 'name should contain at least 3 Char'})
    @IsString({message: 'no number'})
    name: string;

}
