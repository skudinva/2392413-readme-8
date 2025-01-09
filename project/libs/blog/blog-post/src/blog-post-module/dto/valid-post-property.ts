import { PostType } from '@prisma/client';
import { Post, PostExtraProperty } from '@project/shared/core';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

type DependentsPostProperties = Pick<Post, 'postType' | 'extraProperty'>;

function isNotEmpties(
  extraProperty: PostExtraProperty,
  keys: (keyof PostExtraProperty)[]
): boolean {
  return keys.every((key) => {
    const value = extraProperty[key];
    return value !== undefined && value !== null && value.length > 0;
  });
}

function validateDependentsPostProperties(object: DependentsPostProperties) {
  const { postType, extraProperty } = object;
  if (extraProperty === null) {
    return false;
  }

  if (postType === PostType.Link) {
    return isNotEmpties(extraProperty, ['url', 'describe']);
  } else if (postType === PostType.Photo) {
    return isNotEmpties(extraProperty, ['photo']);
  } else if (postType === PostType.Quote) {
    return isNotEmpties(extraProperty, ['quoteText', 'quoteAuthor']);
  } else if (postType === PostType.Text) {
    return isNotEmpties(extraProperty, ['name', 'announce', 'text']);
  } else if (postType === PostType.Video) {
    return isNotEmpties(extraProperty, ['name', 'url']);
  }
  return false;
}

export function IsValidPostCombination(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPostCombination',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate(_value: any, args: ValidationArguments) {
          const object =
            typeof args.object === 'object' &&
            Object.keys(args.object).includes('postType') &&
            Object.keys(args.object).includes('extraProperty')
              ? (args.object as DependentsPostProperties)
              : null;

          if (object === null) {
            return false;
          }

          return validateDependentsPostProperties(object);
        },
      },
    });
  };
}
