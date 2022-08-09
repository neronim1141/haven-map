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
  setCenterCoord: Coord;
};


export type MutationSetCenterCoordArgs = {
  mapId: Scalars['Int'];
  shiftBy: CoordInput;
};

export type Query = {
  __typename?: 'Query';
  getMapData: Array<Tile>;
  getMaps: Array<Map>;
  getMarkers: Array<Marker>;
};


export type QueryGetMapDataArgs = {
  id: Scalars['Int'];
};


export type QueryGetMarkersArgs = {
  hidden: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  MapMerges: MapMerge;
  getMapUpdates: Tile;
};


export type SubscriptionMapMergesArgs = {
  id: Scalars['Int'];
};


export type SubscriptionGetMapUpdatesArgs = {
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

export type SetCenterCoordMutationVariables = Exact<{
  mapId: Scalars['Int'];
  shiftBy: CoordInput;
}>;


export type SetCenterCoordMutation = { __typename?: 'Mutation', setCenterCoord: { __typename?: 'Coord', x: number, y: number } };

export type GetMapDataQueryVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type GetMapDataQuery = { __typename?: 'Query', getMapData: Array<{ __typename?: 'Tile', x: number, y: number, z: number, lastUpdated: string, mapId: number }> };

export type GetMapsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMapsQuery = { __typename?: 'Query', getMaps: Array<{ __typename?: 'Map', id: number, name?: string | null, hidden: boolean }> };

export type GetMarkersQueryVariables = Exact<{
  hidden?: InputMaybe<Scalars['Boolean']>;
}>;


export type GetMarkersQuery = { __typename?: 'Query', getMarkers: Array<{ __typename?: 'Marker', id: number, name: string, x: number, y: number, image?: string | null, mapId: number }> };

export type GetMapDataUpdatesSubscriptionVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type GetMapDataUpdatesSubscription = { __typename?: 'Subscription', getMapUpdates: { __typename?: 'Tile', x: number, y: number, z: number, lastUpdated: string, mapId: number } };

export type GetMapMergesSubscriptionVariables = Exact<{
  mapId: Scalars['Int'];
}>;


export type GetMapMergesSubscription = { __typename?: 'Subscription', MapMerges: { __typename?: 'MapMerge', to: number, shift: { __typename?: 'Coord', x: number, y: number } } };


export const SetCenterCoordDocument = gql`
    mutation SetCenterCoord($mapId: Int!, $shiftBy: CoordInput!) {
  setCenterCoord(mapId: $mapId, shiftBy: $shiftBy) {
    x
    y
  }
}
    `;
export type SetCenterCoordMutationFn = Apollo.MutationFunction<SetCenterCoordMutation, SetCenterCoordMutationVariables>;

/**
 * __useSetCenterCoordMutation__
 *
 * To run a mutation, you first call `useSetCenterCoordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCenterCoordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCenterCoordMutation, { data, loading, error }] = useSetCenterCoordMutation({
 *   variables: {
 *      mapId: // value for 'mapId'
 *      shiftBy: // value for 'shiftBy'
 *   },
 * });
 */
export function useSetCenterCoordMutation(baseOptions?: Apollo.MutationHookOptions<SetCenterCoordMutation, SetCenterCoordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetCenterCoordMutation, SetCenterCoordMutationVariables>(SetCenterCoordDocument, options);
      }
export type SetCenterCoordMutationHookResult = ReturnType<typeof useSetCenterCoordMutation>;
export type SetCenterCoordMutationResult = Apollo.MutationResult<SetCenterCoordMutation>;
export type SetCenterCoordMutationOptions = Apollo.BaseMutationOptions<SetCenterCoordMutation, SetCenterCoordMutationVariables>;
export const GetMapDataDocument = gql`
    query GetMapData($mapId: Int!) {
  getMapData(id: $mapId) {
    x
    y
    z
    lastUpdated
    mapId
  }
}
    `;

/**
 * __useGetMapDataQuery__
 *
 * To run a query within a React component, call `useGetMapDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMapDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapDataQuery({
 *   variables: {
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useGetMapDataQuery(baseOptions: Apollo.QueryHookOptions<GetMapDataQuery, GetMapDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMapDataQuery, GetMapDataQueryVariables>(GetMapDataDocument, options);
      }
export function useGetMapDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMapDataQuery, GetMapDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMapDataQuery, GetMapDataQueryVariables>(GetMapDataDocument, options);
        }
export type GetMapDataQueryHookResult = ReturnType<typeof useGetMapDataQuery>;
export type GetMapDataLazyQueryHookResult = ReturnType<typeof useGetMapDataLazyQuery>;
export type GetMapDataQueryResult = Apollo.QueryResult<GetMapDataQuery, GetMapDataQueryVariables>;
export const GetMapsDocument = gql`
    query GetMaps {
  getMaps {
    id
    name
    hidden
  }
}
    `;

/**
 * __useGetMapsQuery__
 *
 * To run a query within a React component, call `useGetMapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMapsQuery(baseOptions?: Apollo.QueryHookOptions<GetMapsQuery, GetMapsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMapsQuery, GetMapsQueryVariables>(GetMapsDocument, options);
      }
export function useGetMapsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMapsQuery, GetMapsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMapsQuery, GetMapsQueryVariables>(GetMapsDocument, options);
        }
export type GetMapsQueryHookResult = ReturnType<typeof useGetMapsQuery>;
export type GetMapsLazyQueryHookResult = ReturnType<typeof useGetMapsLazyQuery>;
export type GetMapsQueryResult = Apollo.QueryResult<GetMapsQuery, GetMapsQueryVariables>;
export const GetMarkersDocument = gql`
    query GetMarkers($hidden: Boolean = false) {
  getMarkers(hidden: $hidden) {
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
 * __useGetMarkersQuery__
 *
 * To run a query within a React component, call `useGetMarkersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarkersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarkersQuery({
 *   variables: {
 *      hidden: // value for 'hidden'
 *   },
 * });
 */
export function useGetMarkersQuery(baseOptions?: Apollo.QueryHookOptions<GetMarkersQuery, GetMarkersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMarkersQuery, GetMarkersQueryVariables>(GetMarkersDocument, options);
      }
export function useGetMarkersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMarkersQuery, GetMarkersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMarkersQuery, GetMarkersQueryVariables>(GetMarkersDocument, options);
        }
export type GetMarkersQueryHookResult = ReturnType<typeof useGetMarkersQuery>;
export type GetMarkersLazyQueryHookResult = ReturnType<typeof useGetMarkersLazyQuery>;
export type GetMarkersQueryResult = Apollo.QueryResult<GetMarkersQuery, GetMarkersQueryVariables>;
export const GetMapDataUpdatesDocument = gql`
    subscription GetMapDataUpdates($mapId: Int!) {
  getMapUpdates(id: $mapId) {
    x
    y
    z
    lastUpdated
    mapId
  }
}
    `;

/**
 * __useGetMapDataUpdatesSubscription__
 *
 * To run a query within a React component, call `useGetMapDataUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetMapDataUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapDataUpdatesSubscription({
 *   variables: {
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useGetMapDataUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetMapDataUpdatesSubscription, GetMapDataUpdatesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetMapDataUpdatesSubscription, GetMapDataUpdatesSubscriptionVariables>(GetMapDataUpdatesDocument, options);
      }
export type GetMapDataUpdatesSubscriptionHookResult = ReturnType<typeof useGetMapDataUpdatesSubscription>;
export type GetMapDataUpdatesSubscriptionResult = Apollo.SubscriptionResult<GetMapDataUpdatesSubscription>;
export const GetMapMergesDocument = gql`
    subscription GetMapMerges($mapId: Int!) {
  MapMerges(id: $mapId) {
    to
    shift {
      x
      y
    }
  }
}
    `;

/**
 * __useGetMapMergesSubscription__
 *
 * To run a query within a React component, call `useGetMapMergesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetMapMergesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMapMergesSubscription({
 *   variables: {
 *      mapId: // value for 'mapId'
 *   },
 * });
 */
export function useGetMapMergesSubscription(baseOptions: Apollo.SubscriptionHookOptions<GetMapMergesSubscription, GetMapMergesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetMapMergesSubscription, GetMapMergesSubscriptionVariables>(GetMapMergesDocument, options);
      }
export type GetMapMergesSubscriptionHookResult = ReturnType<typeof useGetMapMergesSubscription>;
export type GetMapMergesSubscriptionResult = Apollo.SubscriptionResult<GetMapMergesSubscription>;