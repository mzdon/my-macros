import {UserData} from 'schemas/User';

export interface UserInfoStepProps<R = string> {
  data: UserData;
  onUpdate: (v: Record<string, R>) => void;
}
