import { PostType } from '@prisma/client';
import { Post, PostExtraProperty } from '@project/shared/core';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

type DependentsPostProperties = Pick<Post, 'postType' | 'extraProperty'>;

const validPostTypeProperties: Map<PostType, (keyof PostExtraProperty)[]> =
  new Map([
    [PostType.Link, ['url', 'describe']],
    [PostType.Photo, ['photo']],
    [PostType.Quote, ['quoteText', 'quoteAuthor']],
    [PostType.Text, ['name', 'announce', 'text']],
    [PostType.Video, ['name', 'url']],
  ]);

function isNotEmpties(
  extraProperty: PostExtraProperty,
  keys: (keyof PostExtraProperty)[]
): boolean {
  return keys.every((key) => {
    const value = extraProperty[key];
    return value !== undefined && value !== null && value.length > 0;
  });
}

function isValidFieldSet(
  extraProperty: PostExtraProperty,
  keys: (keyof PostExtraProperty)[]
): boolean {
  return Object.keys(extraProperty).every((key) => {
    if (keys.findIndex((validKey) => validKey === key) !== -1) {
      return true;
    }

    const value = extraProperty[key];
    return value === undefined || value === null || !value.length;
  });
}

function validateDependentsPostProperties(object: DependentsPostProperties) {
  const { postType, extraProperty } = object;
  if (extraProperty === null) {
    return false;
  }
  const validField = validPostTypeProperties.get(postType);
  if (!validField.length) {
    return false;
  }

  if (!isValidFieldSet(extraProperty, validField)) {
    return false;
  }

  return isNotEmpties(extraProperty, validField);
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
