import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  from: Scalars['Int'];
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
  type: Scalars['String'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignRole: Scalars['String'];
  changePassword: Scalars['String'];
  createUser: Scalars['String'];
  rebuildZooms: Scalars['Boolean'];
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


export type MutationRebuildZoomsArgs = {
  mapId: Scalars['Int'];
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Character: ResolverTypeWrapper<Character>;
  Coord: ResolverTypeWrapper<Coord>;
  CoordInput: CoordInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Map: ResolverTypeWrapper<Map>;
  MapMerge: ResolverTypeWrapper<MapMerge>;
  Marker: ResolverTypeWrapper<Marker>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Tile: ResolverTypeWrapper<Tile>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Character: Character;
  Coord: Coord;
  CoordInput: CoordInput;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Map: Map;
  MapMerge: MapMerge;
  Marker: Marker;
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Tile: Tile;
  User: User;
};

export type CharacterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Character'] = ResolversParentTypes['Character']> = {
  expire?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inMap?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoordResolvers<ContextType = any, ParentType extends ResolversParentTypes['Coord'] = ResolversParentTypes['Coord']> = {
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapResolvers<ContextType = any, ParentType extends ResolversParentTypes['Map'] = ResolversParentTypes['Map']> = {
  hidden?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapMergeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapMerge'] = ResolversParentTypes['MapMerge']> = {
  from?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shift?: Resolver<ResolversTypes['Coord'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarkerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Marker'] = ResolversParentTypes['Marker']> = {
  hidden?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mapId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  assignRole?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationAssignRoleArgs, 'name' | 'role'>>;
  changePassword?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'name' | 'password'>>;
  createUser?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'name' | 'password'>>;
  rebuildZooms?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRebuildZoomsArgs, 'mapId'>>;
  shiftCoord?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationShiftCoordArgs, 'mapId' | 'shiftBy'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  map?: Resolver<Array<ResolversTypes['Tile']>, ParentType, ContextType, RequireFields<QueryMapArgs, 'id'>>;
  maps?: Resolver<Array<ResolversTypes['Map']>, ParentType, ContextType>;
  markers?: Resolver<Array<ResolversTypes['Marker']>, ParentType, ContextType, RequireFields<QueryMarkersArgs, 'hidden'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'name'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  characters?: SubscriptionResolver<Array<ResolversTypes['Character']>, "characters", ParentType, ContextType>;
  mapMerges?: SubscriptionResolver<ResolversTypes['MapMerge'], "mapMerges", ParentType, ContextType>;
  mapUpdates?: SubscriptionResolver<ResolversTypes['Tile'], "mapUpdates", ParentType, ContextType, RequireFields<SubscriptionMapUpdatesArgs, 'id'>>;
};

export type TileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tile'] = ResolversParentTypes['Tile']> = {
  lastUpdated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mapId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  z?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Character?: CharacterResolvers<ContextType>;
  Coord?: CoordResolvers<ContextType>;
  Map?: MapResolvers<ContextType>;
  MapMerge?: MapMergeResolvers<ContextType>;
  Marker?: MarkerResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Tile?: TileResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

