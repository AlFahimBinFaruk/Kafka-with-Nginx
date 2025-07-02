// src/query/query.service.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { gql, request } from 'graphql-request';
import { AuthVerificationService } from '../auth-verification/auth-verification.service';

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
  constructor(
    private readonly authVerificationService: AuthVerificationService,
  ) {}

  private readonly logger = new Logger(QueryService.name);
  private readonly endpoint =
    'https://api.studio.thegraph.com/query/112505/simple-registry/version/latest';
  private readonly headers = {
    Authorization: `Bearer ${process.env.THE_GRAPH_TOKEN}`,
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

  private async validateHeader(authHeader): Promise<boolean> {
    const jwt = authHeader?.split(' ')[1];
    if (!jwt) {
      return false;
    }

    try {
      const isValid = await this.authVerificationService.verifyToken(jwt);
      if (!isValid) {
        return false;
      }
    } catch (err) {
      return false;
    }
    return true;
  }

  async getRegistereds(authHeader, limit): Promise<Registered[]> {
    const validation = await this.validateHeader(authHeader);
    if (!validation) {
      throw new UnauthorizedException('Validation failed!');
    }
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
  async getRemoveds(authHeader, limit): Promise<Removed[]> {
    const validation = await this.validateHeader(authHeader);
    if (!validation) {
      throw new UnauthorizedException('Validation failed!');
    }
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

  async getUpdateds(authHeader, limit): Promise<Updated[]> {
    const validation = await this.validateHeader(authHeader);
    if (!validation) {
      throw new UnauthorizedException('Validation failed!');
    }
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
