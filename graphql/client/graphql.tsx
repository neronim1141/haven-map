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
  shift: Coord;
  to: Scalars['Int'];
};

export type Marker = {
  __typename?: 'Marker';
  hidden: Scalars['Boolean'];
  id: Scalars['Int'];
  image?: Maybe<Scalars['String']>;
  mapId: Scalars['Int'];
  name: Scalars['String'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignRole: Scalars['String'];
  changePassword: Scalars['String'];
  createUser: Scalars['String'];
  shiftCoord: Scalars['Boolean'];
};


export type MutationAssignRoleArgs = {
  name: Scalars['String'];
  role: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationShiftCoordArgs = {
  mapId: Scalars['Int'];
  shiftBy: CoordInput;
};

export type Query = {
  __typename?: 'Query';
  map: Array<Tile>;
  maps: Array<Map>;
  markers: Array<Marker>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryMapArgs = {
  id: Scalars['Int'];
};


export type QueryMarkersArgs = {
  hidden: Scalars['Boolean'];
  ids: Array<InputMaybe<Scalars['Int']>>;
};


export type QueryUserArgs = {
  name: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  characters: Array<Character>;
  mapMerges: MapMerge;
  mapUpdates: Tile;
};


export type SubscriptionCharactersArgs = {
  ids: Array<InputMaybe<Scalars['Int']>>;
};


export type SubscriptionMapMergesArgs = {
  id: Scalars['Int'];
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
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: string };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: string };

export type ShiftCoordMutationVariables = Exact<{
  mapId: Scalars['Int'];
  shiftBy: CoordInput;
}>;


export type ShiftCoordMutation = { __typename?: 'Mutation', shiftCoord: boolean };

export type MapQueryVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type MapQuery = { __typename?: 'Query', map: Array<{ __typename?: 'Tile', x: number, y: number, z: number, lastUpdated: string, mapId: number }> };

export type MapsQueryVariables = Exact<{ [key: string]: never; }>;


export type MapsQuery = { __typename?: 'Query', maps: Array<{ __typename?: 'Map', id: number, name?: string | null, hidden: boolean }> };

export type MarkersQueryVariables = Exact<{
  hidden?: InputMaybe<Scalars['Boolean']>;
  ids: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
}>;


export type MarkersQuery = { __typename?: 'Query', markers: Array<{ __typename?: 'Marker', id: number, name: string, x: number, y: number, image?: string | null, mapId: number }> };

export type UserQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', name: string, role: string, token: string } | null };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', name: string, role: string, token: string }> };

export type CharactersSubscriptionVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CharactersSubscription = { __typename?: 'Subscription', characters: Array<{ __typename?: 'Character', id: string, name: string, type: string, inMap: number, expire: number, x: number, y: number }> };

export type MapMergesSubscriptionVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type MapMergesSubscription = { __typename?: 'Subscription', mapMerges: { __typename?: 'MapMerge', to: number, shift: { __typename?: 'Coord', x: number, y: number } } };

export type MapUpdatesSubscriptionVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type MapUpdatesSubscription = { __typename?: 'Subscription', mapUpdates: { __typename?: 'Tile', x: number, y: number, z: number, lastUpdated: string, mapId: number } };


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
    mutation ChangePassword($name: String!, $password: String!) {
  changePassword(name: $name, password: $password)
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
export const MapDocument = gql`
    query Map($mapId: Int!) {
  map(id: $mapId) {
    x
    y
    z
    lastUpdated
    mapId
  }
}
    `;

/**
 * __useMapQuery__
 *
 * To run a query within a React component, call `useMapQuery` and pass it any options that fit your needs.
 * When your component renders, `useMapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapQuery({
 *   variables: {
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useMapQuery(baseOptions: Apollo.QueryHookOptions<MapQuery, MapQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MapQuery, MapQueryVariables>(MapDocument, options);
      }
export function useMapLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MapQuery, MapQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MapQuery, MapQueryVariables>(MapDocument, options);
        }
export type MapQueryHookResult = ReturnType<typeof useMapQuery>;
export type MapLazyQueryHookResult = ReturnType<typeof useMapLazyQuery>;
export type MapQueryResult = Apollo.QueryResult<MapQuery, MapQueryVariables>;
export const MapsDocument = gql`
    query Maps {
  maps {
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
    query Markers($hidden: Boolean = false, $ids: [Int]!) {
  markers(hidden: $hidden, ids: $ids) {
    id
    name
    x
    y
    image
    mapId
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
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useMarkersQuery(baseOptions: Apollo.QueryHookOptions<MarkersQuery, MarkersQueryVariables>) {
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
    subscription Characters($ids: [Int!]!) {
  characters(ids: $ids) {
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
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useCharactersSubscription(baseOptions: Apollo.SubscriptionHookOptions<CharactersSubscription, CharactersSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<CharactersSubscription, CharactersSubscriptionVariables>(CharactersDocument, options);
      }
export type CharactersSubscriptionHookResult = ReturnType<typeof useCharactersSubscription>;
export type CharactersSubscriptionResult = Apollo.SubscriptionResult<CharactersSubscription>;
export const MapMergesDocument = gql`
    subscription MapMerges($mapId: Int!) {
  mapMerges(id: $mapId) {
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
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useMapMergesSubscription(baseOptions: Apollo.SubscriptionHookOptions<MapMergesSubscription, MapMergesSubscriptionVariables>) {
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