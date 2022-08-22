import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  File: any;
};

export type Character = {
  __typename?: 'Character';
  expire: Scalars['Float'];
  id: Scalars['String'];
  inMap: Scalars['Int'];
  name: Scalars['String'];
  type: Scalars['String'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Coord = {
  __typename?: 'Coord';
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type CoordInput = {
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Map = {
  __typename?: 'Map';
  hidden: Scalars['Boolean'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type MapMerge = {
  __typename?: 'MapMerge';
  from: Scalars['Int'];
  shift: Coord;
  to: Scalars['Int'];
};

export type Marker = {
  __typename?: 'Marker';
  hidden: Scalars['Boolean'];
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  mapId: Scalars['Int'];
  name: Scalars['String'];
  type: Scalars['String'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignRole: Scalars['String'];
  changePassword: Scalars['String'];
  createUser: Scalars['String'];
  deleteMap: Scalars['Boolean'];
  deleteUser: Scalars['String'];
  hideMap: Scalars['Boolean'];
  importMap: Scalars['String'];
  rebuildZooms: Scalars['Boolean'];
  shiftCoord: Scalars['Boolean'];
};


export type MutationAssignRoleArgs = {
  name: Scalars['String'];
  role: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  name: Scalars['String'];
  newPassword: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationDeleteMapArgs = {
  mapId: Scalars['Int'];
};


export type MutationDeleteUserArgs = {
  name: Scalars['String'];
};


export type MutationHideMapArgs = {
  mapId: Scalars['Int'];
};


export type MutationImportMapArgs = {
  file: Scalars['File'];
};


export type MutationRebuildZoomsArgs = {
  mapId: Scalars['Int'];
};


export type MutationShiftCoordArgs = {
  mapId: Scalars['Int'];
  shiftBy: CoordInput;
};

export type Query = {
  __typename?: 'Query';
  maps: Array<Map>;
  markers: Array<Marker>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryMapsArgs = {
  hidden: Scalars['Boolean'];
};


export type QueryMarkersArgs = {
  hidden: Scalars['Boolean'];
};


export type QueryUserArgs = {
  name: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  characters: Array<Character>;
  mapMerges?: Maybe<MapMerge>;
  mapUpdates?: Maybe<Tile>;
};


export type SubscriptionMapUpdatesArgs = {
  id: Scalars['Int'];
};

export type Tile = {
  __typename?: 'Tile';
  lastUpdated: Scalars['String'];
  mapId: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
  z: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  name: Scalars['String'];
  role: Scalars['String'];
  token: Scalars['String'];
};

export type AssignRoleMutationVariables = Exact<{
  name: Scalars['String'];
  role: Scalars['String'];
}>;


export type AssignRoleMutation = { __typename?: 'Mutation', assignRole: string };

export type ChangePasswordMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: string };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: string };

export type DeleteUserMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: string };

export type ImportMapMutationVariables = Exact<{
  zipFile: Scalars['File'];
}>;


export type ImportMapMutation = { __typename?: 'Mutation', importMap: string };

export type RebuildZoomsMutationVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type RebuildZoomsMutation = { __typename?: 'Mutation', rebuildZooms: boolean };

export type ShiftCoordMutationVariables = Exact<{
  mapId: Scalars['Int'];
  shiftBy: CoordInput;
}>;


export type ShiftCoordMutation = { __typename?: 'Mutation', shiftCoord: boolean };

export type MapsQueryVariables = Exact<{
  hidden?: InputMaybe<Scalars['Boolean']>;
}>;


export type MapsQuery = { __typename?: 'Query', maps: Array<{ __typename?: 'Map', id: number, name?: string | null, hidden: boolean }> };

export type MarkersQueryVariables = Exact<{
  hidden?: InputMaybe<Scalars['Boolean']>;
}>;


export type MarkersQuery = { __typename?: 'Query', markers: Array<{ __typename?: 'Marker', id: string, name: string, x: number, y: number, image?: string | null, mapId: number, type: string }> };

export type UserQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', name: string, role: string, token: string } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', name: string, role: string, token: string }> };

export type CharactersSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CharactersSubscription = { __typename?: 'Subscription', characters: Array<{ __typename?: 'Character', id: string, name: string, type: string, inMap: number, expire: number, x: number, y: number }> };

export type MapMergesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MapMergesSubscription = { __typename?: 'Subscription', mapMerges?: { __typename?: 'MapMerge', from: number, to: number, shift: { __typename?: 'Coord', x: number, y: number } } | null };

export type MapUpdatesSubscriptionVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type MapUpdatesSubscription = { __typename?: 'Subscription', mapUpdates?: { __typename?: 'Tile', x: number, y: number, z: number, lastUpdated: string, mapId: number } | null };


export const AssignRoleDocument = gql`
    mutation AssignRole($name: String!, $role: String!) {
  assignRole(name: $name, role: $role)
}
    `;
export type AssignRoleMutationFn = Apollo.MutationFunction<AssignRoleMutation, AssignRoleMutationVariables>;

/**
 * __useAssignRoleMutation__
 *
 * To run a mutation, you first call `useAssignRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignRoleMutation, { data, loading, error }] = useAssignRoleMutation({
 *   variables: {
 *      name: // value for 'name'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useAssignRoleMutation(baseOptions?: Apollo.MutationHookOptions<AssignRoleMutation, AssignRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignRoleMutation, AssignRoleMutationVariables>(AssignRoleDocument, options);
      }
export type AssignRoleMutationHookResult = ReturnType<typeof useAssignRoleMutation>;
export type AssignRoleMutationResult = Apollo.MutationResult<AssignRoleMutation>;
export type AssignRoleMutationOptions = Apollo.BaseMutationOptions<AssignRoleMutation, AssignRoleMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($name: String!, $password: String!, $newPassword: String!) {
  changePassword(name: $name, password: $password, newPassword: $newPassword)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      name: // value for 'name'
 *      password: // value for 'password'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($name: String!, $password: String!) {
  createUser(name: $name, password: $password)
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($name: String!) {
  deleteUser(name: $name)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ImportMapDocument = gql`
    mutation ImportMap($zipFile: File!) {
  importMap(file: $zipFile)
}
    `;
export type ImportMapMutationFn = Apollo.MutationFunction<ImportMapMutation, ImportMapMutationVariables>;

/**
 * __useImportMapMutation__
 *
 * To run a mutation, you first call `useImportMapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImportMapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [importMapMutation, { data, loading, error }] = useImportMapMutation({
 *   variables: {
 *      zipFile: // value for 'zipFile'
 *   },
 * });
 */
export function useImportMapMutation(baseOptions?: Apollo.MutationHookOptions<ImportMapMutation, ImportMapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ImportMapMutation, ImportMapMutationVariables>(ImportMapDocument, options);
      }
export type ImportMapMutationHookResult = ReturnType<typeof useImportMapMutation>;
export type ImportMapMutationResult = Apollo.MutationResult<ImportMapMutation>;
export type ImportMapMutationOptions = Apollo.BaseMutationOptions<ImportMapMutation, ImportMapMutationVariables>;
export const RebuildZoomsDocument = gql`
    mutation rebuildZooms($mapId: Int!) {
  rebuildZooms(mapId: $mapId)
}
    `;
export type RebuildZoomsMutationFn = Apollo.MutationFunction<RebuildZoomsMutation, RebuildZoomsMutationVariables>;

/**
 * __useRebuildZoomsMutation__
 *
 * To run a mutation, you first call `useRebuildZoomsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRebuildZoomsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rebuildZoomsMutation, { data, loading, error }] = useRebuildZoomsMutation({
 *   variables: {
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useRebuildZoomsMutation(baseOptions?: Apollo.MutationHookOptions<RebuildZoomsMutation, RebuildZoomsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RebuildZoomsMutation, RebuildZoomsMutationVariables>(RebuildZoomsDocument, options);
      }
export type RebuildZoomsMutationHookResult = ReturnType<typeof useRebuildZoomsMutation>;
export type RebuildZoomsMutationResult = Apollo.MutationResult<RebuildZoomsMutation>;
export type RebuildZoomsMutationOptions = Apollo.BaseMutationOptions<RebuildZoomsMutation, RebuildZoomsMutationVariables>;
export const ShiftCoordDocument = gql`
    mutation ShiftCoord($mapId: Int!, $shiftBy: CoordInput!) {
  shiftCoord(mapId: $mapId, shiftBy: $shiftBy)
}
    `;
export type ShiftCoordMutationFn = Apollo.MutationFunction<ShiftCoordMutation, ShiftCoordMutationVariables>;

/**
 * __useShiftCoordMutation__
 *
 * To run a mutation, you first call `useShiftCoordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShiftCoordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shiftCoordMutation, { data, loading, error }] = useShiftCoordMutation({
 *   variables: {
 *      mapId: // value for 'mapId'
 *      shiftBy: // value for 'shiftBy'
 *   },
 * });
 */
export function useShiftCoordMutation(baseOptions?: Apollo.MutationHookOptions<ShiftCoordMutation, ShiftCoordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShiftCoordMutation, ShiftCoordMutationVariables>(ShiftCoordDocument, options);
      }
export type ShiftCoordMutationHookResult = ReturnType<typeof useShiftCoordMutation>;
export type ShiftCoordMutationResult = Apollo.MutationResult<ShiftCoordMutation>;
export type ShiftCoordMutationOptions = Apollo.BaseMutationOptions<ShiftCoordMutation, ShiftCoordMutationVariables>;
export const MapsDocument = gql`
    query Maps($hidden: Boolean = false) {
  maps(hidden: $hidden) {
    id
    name
    hidden
  }
}
    `;

/**
 * __useMapsQuery__
 *
 * To run a query within a React component, call `useMapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapsQuery({
 *   variables: {
 *      hidden: // value for 'hidden'
 *   },
 * });
 */
export function useMapsQuery(baseOptions?: Apollo.QueryHookOptions<MapsQuery, MapsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MapsQuery, MapsQueryVariables>(MapsDocument, options);
      }
export function useMapsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MapsQuery, MapsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MapsQuery, MapsQueryVariables>(MapsDocument, options);
        }
export type MapsQueryHookResult = ReturnType<typeof useMapsQuery>;
export type MapsLazyQueryHookResult = ReturnType<typeof useMapsLazyQuery>;
export type MapsQueryResult = Apollo.QueryResult<MapsQuery, MapsQueryVariables>;
export const MarkersDocument = gql`
    query Markers($hidden: Boolean = false) {
  markers(hidden: $hidden) {
    id
    name
    x
    y
    image
    mapId
    type
  }
}
    `;

/**
 * __useMarkersQuery__
 *
 * To run a query within a React component, call `useMarkersQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarkersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarkersQuery({
 *   variables: {
 *      hidden: // value for 'hidden'
 *   },
 * });
 */
export function useMarkersQuery(baseOptions?: Apollo.QueryHookOptions<MarkersQuery, MarkersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarkersQuery, MarkersQueryVariables>(MarkersDocument, options);
      }
export function useMarkersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarkersQuery, MarkersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarkersQuery, MarkersQueryVariables>(MarkersDocument, options);
        }
export type MarkersQueryHookResult = ReturnType<typeof useMarkersQuery>;
export type MarkersLazyQueryHookResult = ReturnType<typeof useMarkersLazyQuery>;
export type MarkersQueryResult = Apollo.QueryResult<MarkersQuery, MarkersQueryVariables>;
export const UserDocument = gql`
    query User($name: String!) {
  user(name: $name) {
    name
    role
    token
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    name
    role
    token
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const CharactersDocument = gql`
    subscription Characters {
  characters {
    id
    name
    type
    inMap
    expire
    x
    y
  }
}
    `;

/**
 * __useCharactersSubscription__
 *
 * To run a query within a React component, call `useCharactersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCharactersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCharactersSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCharactersSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CharactersSubscription, CharactersSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CharactersSubscription, CharactersSubscriptionVariables>(CharactersDocument, options);
      }
export type CharactersSubscriptionHookResult = ReturnType<typeof useCharactersSubscription>;
export type CharactersSubscriptionResult = Apollo.SubscriptionResult<CharactersSubscription>;
export const MapMergesDocument = gql`
    subscription MapMerges {
  mapMerges {
    from
    to
    shift {
      x
      y
    }
  }
}
    `;

/**
 * __useMapMergesSubscription__
 *
 * To run a query within a React component, call `useMapMergesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMapMergesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapMergesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useMapMergesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MapMergesSubscription, MapMergesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MapMergesSubscription, MapMergesSubscriptionVariables>(MapMergesDocument, options);
      }
export type MapMergesSubscriptionHookResult = ReturnType<typeof useMapMergesSubscription>;
export type MapMergesSubscriptionResult = Apollo.SubscriptionResult<MapMergesSubscription>;
export const MapUpdatesDocument = gql`
    subscription MapUpdates($mapId: Int!) {
  mapUpdates(id: $mapId) {
    x
    y
    z
    lastUpdated
    mapId
  }
}
    `;

/**
 * __useMapUpdatesSubscription__
 *
 * To run a query within a React component, call `useMapUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMapUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapUpdatesSubscription({
 *   variables: {
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useMapUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<MapUpdatesSubscription, MapUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MapUpdatesSubscription, MapUpdatesSubscriptionVariables>(MapUpdatesDocument, options);
      }
export type MapUpdatesSubscriptionHookResult = ReturnType<typeof useMapUpdatesSubscription>;
export type MapUpdatesSubscriptionResult = Apollo.SubscriptionResult<MapUpdatesSubscription>;