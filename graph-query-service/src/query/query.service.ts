// src/query/query.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { gql, request } from 'graphql-request';

// Define TypeScript interfaces for the data types
export interface Registered {
  id: string;
  user: string;
  internal_id: string;
  metadata: string;
}
export interface Removed {
  id: string;
  internal_id: string;
  executor: string;
  blockNumber: string;
}
export interface Updated {
  id: string;
  internal_id: string;
  oldMeta: string;
  newMeta: string;
  blockNumber: string;
}

@Injectable()
export class QueryService {
  private readonly logger = new Logger(QueryService.name);
  private readonly endpoint =
    'https://api.studio.thegraph.com/query/112505/simple-registry/version/latest';
  private readonly headers = {
    Authorization: `Bearer b75277218d17d5ddde884ce22f2ffda0`,
  };

  private async executeQuery<T>(
    query: string,
    variables: Record<string, any>,
  ): Promise<T> {
    try {
      return await request(this.endpoint, query, variables, this.headers);
    } catch (error) {
      this.logger.error('GraphQL query failed', error);
      throw new Error('Failed to fetch data from subgraph');
    }
  }

  async getRegistereds(limit): Promise<Registered[]> {
    const query = gql`
      query GetRegistereds($first: Int!) {
        registereds(first: $first) {
          id
          user
          internal_id
          metadata
        }
      }
    `;
    const data = await this.executeQuery<{ registereds: Registered[] }>(query, {
      first: limit,
    });
    return data.registereds;
  }
  async getRemoveds(limit): Promise<Removed[]> {
    const query = gql`
      query GetRemoveds($first: Int!) {
        removeds(first: $first) {
          id
          executor
          blockNumber
        }
      }
    `;
    const data = await this.executeQuery<{ removeds: Removed[] }>(query, {
      first: limit,
    });
    return data.removeds;
  }

  async getUpdateds(limit): Promise<Updated[]> {
    const query = gql`
      query GetUpdateds($first: Int!) {
        updateds(first: $first) {
          id
          internal_id
          oldMeta
          newMeta
          blockNumber
        }
      }
    `;
    const data = await this.executeQuery<{ updateds: Updated[] }>(query, {
      first: limit,
    });
    return data.updateds;
  }
}
