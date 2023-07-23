import {
  Equals,
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsAlphanumeric('fr-FR', {
    message:
      "Votre nom d'utilisateur ne doit contenir que des lettres et des chiffres.",
  })
  username: string;

  @IsEmail(
    {},
    {
      message: 'Votre adresse email doit être valide.',
    },
  )
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'Votre mot de passe doit au moins contenir : 8 caractères, 1 chiffre, 1 majuscule et 1 symbole.',
    },
  )
  password: string;

  @Equals(true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  })
  eula: boolean;
}

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'Votre adresse email doit être valide.',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Votre mot de passe ne doit pas être vide.',
  })
  password: string;
}
