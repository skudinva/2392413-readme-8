import { PostType } from '@prisma/client';
import { PostExtraProperty } from '@project/shared/core';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

interface DependentsPostProperties {
  postType: PostType;
  extraProperty: PostExtraProperty;
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

          const { postType, extraProperty } = object;

          if (postType === PostType.Link) {
            return (
              (extraProperty.url ?? '').length > 0 &&
              (extraProperty.describe ?? '').length > 0
            );
          } else if (postType === PostType.Photo) {
            return (extraProperty.photo ?? '').length > 0;
          } else if (postType === PostType.Quote) {
            return (extraProperty.text ?? '').length > 0;
          } else if (postType === PostType.Text) {
            return (
              (extraProperty.name ?? '').length > 0 &&
              (extraProperty.announce ?? '').length > 0 &&
              (extraProperty.text ?? '').length > 0
            );
          } else if (postType === PostType.Video) {
            return (
              (extraProperty.name ?? '').length > 0 &&
              (extraProperty.url ?? '').length > 0
            );
          }

          return false;
        },
      },
    });
  };
}
