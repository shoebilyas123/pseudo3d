import { Vector } from '../geometry';

export interface UserDataMandatoryKeys {
  pos: Vector;
}
export type ColliderUserData = any & UserDataMandatoryKeys;
