/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TokenObtainPair {
  /**
   * Email
   * @minLength 1
   */
  email: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserList {
  /** ID */
  id?: number;
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 50
   */
  email: string;
  /**
   * ФИО
   * @minLength 1
   * @maxLength 80
   */
  full_name: string;
  /** Роль */
  role?: "Admin" | "Teacher" | "Student";
  /**
   * Код студента
   * @maxLength 8
   */
  student_code?: string | null;
  /**
   * Номер телефона
   * @minLength 1
   * @maxLength 13
   * @pattern ^\+996\d{9}$
   */
  phone: string;
  /** Is active */
  is_active?: boolean;
  /**
   * Blocked at
   * @format date-time
   */
  blocked_at?: string | null;
  /** Group */
  group?: string;
}

export interface FileList {
  /** ID */
  id?: number;
  uploaded_by?: UserList;
  /**
   * File
   * @format uri
   */
  file?: string;
  /**
   * Original name
   * @minLength 1
   * @maxLength 255
   */
  original_name: string;
  /**
   * Size
   * Размер файла в байтах
   * @min 0
   * @max 2147483647
   */
  size: number;
  /**
   * Content type
   * @minLength 1
   * @maxLength 100
   */
  content_type: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface FileUpload {
  /**
   * File
   * @format uri
   */
  file?: string;
}

export interface FileDetail {
  /** ID */
  id?: number;
  uploaded_by?: UserList;
  /**
   * File
   * @format uri
   */
  file?: string;
  /**
   * Original name
   * @minLength 1
   * @maxLength 255
   */
  original_name: string;
  /**
   * Size
   * Размер файла в байтах
   * @min 0
   * @max 2147483647
   */
  size: number;
  /**
   * Content type
   * @minLength 1
   * @maxLength 100
   */
  content_type: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface GroupList {
  /** ID */
  id?: number;
  teacher?: UserList;
  /**
   * Name
   * @minLength 1
   * @maxLength 50
   */
  name: string;
  /**
   * Year
   * @min 1
   * @max 10
   */
  year: number;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface GroupCreate {
  /** Teacher */
  teacher: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 50
   */
  name: string;
  /**
   * Year
   * @min 1
   * @max 10
   */
  year: number;
}

export interface GroupStudent {
  /** ID */
  id?: number;
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 50
   */
  email: string;
  /**
   * ФИО
   * @minLength 1
   * @maxLength 80
   */
  full_name: string;
  /**
   * Код студента
   * @maxLength 8
   */
  student_code?: string | null;
  /**
   * Номер телефона
   * @minLength 1
   * @maxLength 13
   * @pattern ^\+996\d{9}$
   */
  phone: string;
}

export interface GroupDetail {
  /** ID */
  id?: number;
  teacher?: UserList;
  /**
   * Name
   * @minLength 1
   * @maxLength 50
   */
  name: string;
  /**
   * Year
   * @min 1
   * @max 10
   */
  year: number;
  students?: GroupStudent[];
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface GroupUpdate {
  /** Teacher */
  teacher?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 50
   */
  name: string;
  /**
   * Year
   * @min 1
   * @max 10
   */
  year: number;
}

export interface TaskList {
  /** ID */
  id?: number;
  teacher?: UserList;
  /**
   * Title
   * Оригинальная задача от учителя
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /** Status */
  status?: "draft" | "describing" | "review" | "published" | "closed";
  /**
   * Is shared
   * Видна всем учителям
   */
  is_shared?: boolean;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface TaskCreate {
  /**
   * Title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * Description
   * @minLength 1
   * @default ""
   */
  description?: string;
  /**
   * Is shared
   * @default false
   */
  is_shared?: boolean;
  /** @default [] */
  file_ids?: number[];
}

export interface TaskAssignmentList {
  /** ID */
  id?: number;
  task?: TaskList;
  student?: UserList;
  /** Status */
  status?: "pending" | "submitted" | "graded";
  /**
   * Deadline
   * Дедлайн для решения
   * @format date-time
   */
  deadline?: string | null;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface TaskFileOutput {
  /** Id */
  id: number;
  /**
   * Original name
   * @minLength 1
   */
  original_name: string;
  /**
   * File
   * @format uri
   */
  file?: string;
  /** Size */
  size: number;
}

export interface FileOutput {
  /** Id */
  id: number;
  /**
   * Original name
   * @minLength 1
   */
  original_name: string;
  /**
   * File
   * @format uri
   */
  file?: string;
  /** Size */
  size: number;
}

export interface TaskDescriptionInline {
  /** ID */
  id?: number;
  describer?: UserList;
  /**
   * Description
   * Описание задачи от студента
   */
  description?: string;
  /** Status */
  status?: "pending" | "submitted" | "revision" | "approved" | "rejected";
  /**
   * Deadline
   * Дедлайн для написания описания
   * @format date-time
   */
  deadline: string;
  /**
   * Revision comment
   * Комментарий учителя при возврате на доработку
   */
  revision_comment?: string;
  files?: FileOutput[];
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface TaskAssignmentInline {
  /** ID */
  id?: number;
  student?: UserList;
  /** Status */
  status?: "pending" | "submitted" | "graded";
  /**
   * Deadline
   * Дедлайн для решения
   * @format date-time
   */
  deadline?: string | null;
  /** Has submission */
  has_submission?: string;
  /** Score */
  score?: string;
}

export interface TaskDetail {
  /** ID */
  id?: number;
  teacher?: UserList;
  /**
   * Title
   * Оригинальная задача от учителя
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * Description
   * Описание задачи от учителя
   */
  description?: string;
  /** Status */
  status?: "draft" | "describing" | "review" | "published" | "closed";
  /**
   * Is shared
   * Видна всем учителям
   */
  is_shared?: boolean;
  files?: TaskFileOutput[];
  descriptions?: TaskDescriptionInline[];
  assignments?: TaskAssignmentInline[];
  /** Approved description */
  approved_description?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface SubmissionInline {
  /** ID */
  id?: number;
  /**
   * Content
   * Решение студента
   * @minLength 1
   */
  content: string;
  /**
   * Submitted at
   * @format date-time
   */
  submitted_at?: string;
  /**
   * Score
   * Оценка от 1 до 5
   * @min 1
   * @max 5
   */
  score?: number | null;
  /**
   * Teacher comment
   * Комментарий учителя
   */
  teacher_comment?: string;
  files?: FileOutput[];
}

export interface TaskAssignmentDetail {
  /** ID */
  id?: number;
  task?: TaskDetail;
  student?: UserList;
  /** Status */
  status?: "pending" | "submitted" | "graded";
  /**
   * Deadline
   * Дедлайн для решения
   * @format date-time
   */
  deadline?: string | null;
  submission?: SubmissionInline;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface SubmitSolution {
  /**
   * Content
   * @minLength 1
   */
  content: string;
  /** @default [] */
  file_ids?: number[];
}

export interface TaskDescriptionList {
  /** ID */
  id?: number;
  task?: TaskList;
  describer?: UserList;
  /** Status */
  status?: "pending" | "submitted" | "revision" | "approved" | "rejected";
  /**
   * Deadline
   * Дедлайн для написания описания
   * @format date-time
   */
  deadline: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
}

export interface TaskDescriptionDetail {
  /** ID */
  id?: number;
  task?: TaskList;
  describer?: UserList;
  /**
   * Description
   * Описание задачи от студента
   */
  description?: string;
  /** Status */
  status?: "pending" | "submitted" | "revision" | "approved" | "rejected";
  /**
   * Deadline
   * Дедлайн для написания описания
   * @format date-time
   */
  deadline: string;
  /**
   * Revision comment
   * Комментарий учителя при возврате на доработку
   */
  revision_comment?: string;
  files?: FileOutput[];
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface SubmitDescription {
  /**
   * Description
   * @minLength 1
   */
  description: string;
  /** @default [] */
  file_ids?: number[];
}

export interface TaskSubmissionList {
  /** ID */
  id?: number;
  /** Student */
  student?: string;
  /**
   * Task title
   * @minLength 1
   */
  task_title: string;
  /**
   * Submitted at
   * @format date-time
   */
  submitted_at?: string;
  /**
   * Score
   * Оценка от 1 до 5
   * @min 1
   * @max 5
   */
  score?: number | null;
}

export interface TaskSubmissionDetail {
  /** ID */
  id?: number;
  /** Student */
  student?: string;
  /** Task */
  task?: string;
  /**
   * Content
   * Решение студента
   * @minLength 1
   */
  content: string;
  /**
   * Submitted at
   * @format date-time
   */
  submitted_at?: string;
  /**
   * Score
   * Оценка от 1 до 5
   * @min 1
   * @max 5
   */
  score?: number | null;
  /**
   * Teacher comment
   * Комментарий учителя
   */
  teacher_comment?: string;
  files?: FileOutput[];
}

export interface GradeSubmission {
  /**
   * Score
   * @min 1
   * @max 5
   */
  score: number;
  /**
   * Comment
   * @minLength 1
   * @default ""
   */
  comment?: string;
}

export interface TaskUpdate {
  /**
   * Title
   * @minLength 1
   * @maxLength 255
   */
  title?: string;
  /**
   * Description
   * @minLength 1
   */
  description?: string;
  /** Is shared */
  is_shared?: boolean;
  file_ids?: number[];
}

export interface AssignDescriber {
  /** Describer id */
  describer_id: number;
  /**
   * Deadline
   * @format date-time
   */
  deadline: string;
}

export interface Revision {
  /**
   * Comment
   * @minLength 1
   */
  comment: string;
}

export interface PublishTask {
  /**
   * Deadline
   * @format date-time
   */
  deadline: string;
  /** @default [] */
  group_ids?: number[];
  /** @default [] */
  student_ids?: number[];
}

export interface UserCreate {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 50
   */
  email: string;
  /**
   * ФИО
   * @minLength 1
   * @maxLength 80
   */
  full_name: string;
  /**
   * Номер телефона
   * @minLength 1
   * @maxLength 13
   * @pattern ^\+996\d{9}$
   */
  phone: string;
  /** Роль */
  role?: "Admin" | "Teacher" | "Student";
  /**
   * Password
   * @minLength 1
   */
  password: string;
  /**
   * Password confirm
   * @minLength 1
   */
  password_confirm: string;
  /** Группа */
  group?: number | null;
}

export interface UserDetail {
  /** ID */
  id?: number;
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 50
   */
  email: string;
  /**
   * ФИО
   * @minLength 1
   * @maxLength 80
   */
  full_name: string;
  /** Роль */
  role?: "Admin" | "Teacher" | "Student";
  /**
   * Код студента
   * @maxLength 8
   */
  student_code?: string | null;
  /**
   * Номер телефона
   * @minLength 1
   * @maxLength 13
   * @pattern ^\+996\d{9}$
   */
  phone: string;
  /** Is active */
  is_active?: boolean;
  /**
   * Blocked at
   * @format date-time
   */
  blocked_at?: string | null;
  /** Group */
  group?: string;
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Updated at
   * @format date-time
   */
  updated_at?: string;
}

export interface UserUpdate {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 50
   */
  email: string;
  /**
   * ФИО
   * @minLength 1
   * @maxLength 80
   */
  full_name: string;
  /**
   * Номер телефона
   * @minLength 1
   * @maxLength 13
   * @pattern ^\+996\d{9}$
   */
  phone: string;
  /** Группа */
  group?: number | null;
}

export interface ChangePassword {
  /**
   * Password
   * @minLength 1
   */
  password: string;
  /**
   * Password confirm
   * @minLength 1
   */
  password_confirm: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8000/api";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title KNU Okuu Service API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <a_myktybekov@bk.ru>
 *
 * For KNU Okuu Service Rest API
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthJwtLoginCreate
     * @request POST:/auth/jwt/login/
     * @secure
     */
    authJwtLoginCreate: (data: TokenObtainPair, params: RequestParams = {}) =>
      this.request<TokenObtainPair, any>({
        path: `/auth/jwt/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthJwtLogoutCreate
     * @request POST:/auth/jwt/logout/
     * @secure
     */
    authJwtLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/jwt/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthJwtRefreshCreate
     * @request POST:/auth/jwt/refresh/
     * @secure
     */
    authJwtRefreshCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/jwt/refresh/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthMeList
     * @request GET:/auth/me/
     * @secure
     */
    authMeList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/me/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthVerifyOtpCreate
     * @request POST:/auth/verify-otp/
     * @secure
     */
    authVerifyOtpCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/verify-otp/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  errors = {
    /**
     * No description
     *
     * @tags errors
     * @name ErrorsTriggerList
     * @request GET:/errors/trigger/
     * @secure
     */
    errorsTriggerList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/errors/trigger/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags errors
     * @name ErrorsTriggerExceptionList
     * @request GET:/errors/trigger/exception/
     * @secure
     */
    errorsTriggerExceptionList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/errors/trigger/exception/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags errors
     * @name ErrorsTriggerUniqueList
     * @request GET:/errors/trigger/unique/
     * @secure
     */
    errorsTriggerUniqueList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/errors/trigger/unique/`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  files = {
    /**
     * No description
     *
     * @tags files
     * @name FilesList
     * @request GET:/files/
     * @secure
     */
    filesList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      data?: any,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: FileList[];
        },
        any
      >({
        path: `/files/`,
        method: "GET",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags files
     * @name FilesCreate
     * @request POST:/files/
     * @secure
     */
    filesCreate: (
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<FileUpload, any>({
        path: `/files/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags files
     * @name FilesRead
     * @request GET:/files/{id}/
     * @secure
     */
    filesRead: (id: string, data?: any, params: RequestParams = {}) =>
      this.request<FileDetail, any>({
        path: `/files/${id}/`,
        method: "GET",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags files
     * @name FilesDelete
     * @request DELETE:/files/{id}/
     * @secure
     */
    filesDelete: (id: string, data?: any, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/files/${id}/`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  groups = {
    /**
     * No description
     *
     * @tags groups
     * @name GroupsList
     * @request GET:/groups/
     * @secure
     */
    groupsList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: GroupList[];
        },
        any
      >({
        path: `/groups/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups
     * @name GroupsCreate
     * @request POST:/groups/
     * @secure
     */
    groupsCreate: (data: GroupCreate, params: RequestParams = {}) =>
      this.request<GroupCreate, any>({
        path: `/groups/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups
     * @name GroupsRead
     * @request GET:/groups/{id}/
     * @secure
     */
    groupsRead: (id: string, params: RequestParams = {}) =>
      this.request<GroupDetail, any>({
        path: `/groups/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups
     * @name GroupsUpdate
     * @request PUT:/groups/{id}/
     * @secure
     */
    groupsUpdate: (id: string, data: GroupUpdate, params: RequestParams = {}) =>
      this.request<GroupUpdate, any>({
        path: `/groups/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups
     * @name GroupsPartialUpdate
     * @request PATCH:/groups/{id}/
     * @secure
     */
    groupsPartialUpdate: (
      id: string,
      data: GroupUpdate,
      params: RequestParams = {},
    ) =>
      this.request<GroupUpdate, any>({
        path: `/groups/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags groups
     * @name GroupsDelete
     * @request DELETE:/groups/{id}/
     * @secure
     */
    groupsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/groups/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  tasks = {
    /**
     * @description Список заданий
     *
     * @tags tasks
     * @name TasksList
     * @request GET:/tasks/
     * @secure
     */
    tasksList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: TaskList[];
        },
        any
      >({
        path: `/tasks/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создать задание (черновик)
     *
     * @tags tasks
     * @name TasksCreate
     * @request POST:/tasks/
     * @secure
     */
    tasksCreate: (data: TaskCreate, params: RequestParams = {}) =>
      this.request<TaskCreate, any>({
        path: `/tasks/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Мои задания
     *
     * @tags tasks
     * @name TasksAssignmentsList
     * @request GET:/tasks/assignments/
     * @secure
     */
    tasksAssignmentsList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: TaskAssignmentList[];
        },
        any
      >({
        path: `/tasks/assignments/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Детали задания
     *
     * @tags tasks
     * @name TasksAssignmentsRead
     * @request GET:/tasks/assignments/{id}/
     * @secure
     */
    tasksAssignmentsRead: (id: string, params: RequestParams = {}) =>
      this.request<TaskAssignmentDetail, any>({
        path: `/tasks/assignments/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Отправить решение
     *
     * @tags tasks
     * @name TasksAssignmentsSubmit
     * @request POST:/tasks/assignments/{id}/submit/
     * @secure
     */
    tasksAssignmentsSubmit: (
      id: string,
      data: SubmitSolution,
      params: RequestParams = {},
    ) =>
      this.request<SubmitSolution, any>({
        path: `/tasks/assignments/${id}/submit/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Мои описания
     *
     * @tags tasks
     * @name TasksDescriptionsList
     * @request GET:/tasks/descriptions/
     * @secure
     */
    tasksDescriptionsList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: TaskDescriptionList[];
        },
        any
      >({
        path: `/tasks/descriptions/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Детали описания
     *
     * @tags tasks
     * @name TasksDescriptionsRead
     * @request GET:/tasks/descriptions/{id}/
     * @secure
     */
    tasksDescriptionsRead: (id: string, params: RequestParams = {}) =>
      this.request<TaskDescriptionDetail, any>({
        path: `/tasks/descriptions/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Отправить описание на проверку
     *
     * @tags tasks
     * @name TasksDescriptionsSubmit
     * @request POST:/tasks/descriptions/{id}/submit/
     * @secure
     */
    tasksDescriptionsSubmit: (
      id: string,
      data: SubmitDescription,
      params: RequestParams = {},
    ) =>
      this.request<SubmitDescription, any>({
        path: `/tasks/descriptions/${id}/submit/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Список решений
     *
     * @tags tasks
     * @name TasksSubmissionsList
     * @request GET:/tasks/submissions/
     * @secure
     */
    tasksSubmissionsList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: TaskSubmissionList[];
        },
        any
      >({
        path: `/tasks/submissions/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Детали решения
     *
     * @tags tasks
     * @name TasksSubmissionsRead
     * @request GET:/tasks/submissions/{id}/
     * @secure
     */
    tasksSubmissionsRead: (id: string, params: RequestParams = {}) =>
      this.request<TaskSubmissionDetail, any>({
        path: `/tasks/submissions/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Оценить решение
     *
     * @tags tasks
     * @name TasksSubmissionsGrade
     * @request POST:/tasks/submissions/{id}/grade/
     * @secure
     */
    tasksSubmissionsGrade: (
      id: string,
      data: GradeSubmission,
      params: RequestParams = {},
    ) =>
      this.request<GradeSubmission, any>({
        path: `/tasks/submissions/${id}/grade/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Детали задания
     *
     * @tags tasks
     * @name TasksRead
     * @request GET:/tasks/{id}/
     * @secure
     */
    tasksRead: (id: string, params: RequestParams = {}) =>
      this.request<TaskDetail, any>({
        path: `/tasks/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновить задание (только черновик)
     *
     * @tags tasks
     * @name TasksUpdate
     * @request PUT:/tasks/{id}/
     * @secure
     */
    tasksUpdate: (id: string, data: TaskUpdate, params: RequestParams = {}) =>
      this.request<TaskUpdate, any>({
        path: `/tasks/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Задания (для учителя)
     *
     * @tags tasks
     * @name TasksPartialUpdate
     * @request PATCH:/tasks/{id}/
     * @secure
     */
    tasksPartialUpdate: (
      id: string,
      data: TaskUpdate,
      params: RequestParams = {},
    ) =>
      this.request<TaskUpdate, any>({
        path: `/tasks/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удалить задание
     *
     * @tags tasks
     * @name TasksDelete
     * @request DELETE:/tasks/{id}/
     * @secure
     */
    tasksDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/tasks/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Назначить студента-описателя
     *
     * @tags tasks
     * @name TasksAssignDescriber
     * @request POST:/tasks/{id}/assign_describer/
     * @secure
     */
    tasksAssignDescriber: (
      id: string,
      data: AssignDescriber,
      params: RequestParams = {},
    ) =>
      this.request<AssignDescriber, any>({
        path: `/tasks/${id}/assign_describer/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Закрыть задание
     *
     * @tags tasks
     * @name TasksClose
     * @request POST:/tasks/{id}/close/
     * @secure
     */
    tasksClose: (id: string, data: TaskList, params: RequestParams = {}) =>
      this.request<TaskList, any>({
        path: `/tasks/${id}/close/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Принять описание
     *
     * @tags tasks
     * @name TasksDescriptionsApproveDescription
     * @request POST:/tasks/{id}/descriptions/{desc_id}/approve/
     * @secure
     */
    tasksDescriptionsApproveDescription: (
      id: string,
      descId: string,
      data: Revision,
      params: RequestParams = {},
    ) =>
      this.request<Revision, any>({
        path: `/tasks/${id}/descriptions/${descId}/approve/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Вернуть описание на доработку
     *
     * @tags tasks
     * @name TasksDescriptionsRequestRevision
     * @request POST:/tasks/{id}/descriptions/{desc_id}/revision/
     * @secure
     */
    tasksDescriptionsRequestRevision: (
      id: string,
      descId: string,
      data: Revision,
      params: RequestParams = {},
    ) =>
      this.request<Revision, any>({
        path: `/tasks/${id}/descriptions/${descId}/revision/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Опубликовать задание студентам
     *
     * @tags tasks
     * @name TasksPublish
     * @request POST:/tasks/{id}/publish/
     * @secure
     */
    tasksPublish: (id: string, data: PublishTask, params: RequestParams = {}) =>
      this.request<PublishTask, any>({
        path: `/tasks/${id}/publish/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersList
     * @request GET:/users/
     * @secure
     */
    usersList: (
      query?: {
        full_name__icontains?: string;
        student_code__icontains?: string;
        is_active?: string;
        group?: string;
        role?: string;
        /** Number of results to return per page. */
        limit?: number;
        /** The initial index from which to return the results. */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          count: number;
          /** @format uri */
          next?: string | null;
          /** @format uri */
          previous?: string | null;
          results: UserList[];
        },
        any
      >({
        path: `/users/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCreate
     * @request POST:/users/
     * @secure
     */
    usersCreate: (data: UserCreate, params: RequestParams = {}) =>
      this.request<UserCreate, any>({
        path: `/users/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRead
     * @request GET:/users/{id}/
     * @secure
     */
    usersRead: (id: string, params: RequestParams = {}) =>
      this.request<UserDetail, any>({
        path: `/users/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdate
     * @request PUT:/users/{id}/
     * @secure
     */
    usersUpdate: (id: string, data: UserUpdate, params: RequestParams = {}) =>
      this.request<UserUpdate, any>({
        path: `/users/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersPartialUpdate
     * @request PATCH:/users/{id}/
     * @secure
     */
    usersPartialUpdate: (
      id: string,
      data: UserUpdate,
      params: RequestParams = {},
    ) =>
      this.request<UserUpdate, any>({
        path: `/users/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersActivate
     * @request POST:/users/{id}/activate/
     * @secure
     */
    usersActivate: (id: string, data: UserList, params: RequestParams = {}) =>
      this.request<UserList, any>({
        path: `/users/${id}/activate/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersChangePassword
     * @request POST:/users/{id}/change_password/
     * @secure
     */
    usersChangePassword: (
      id: string,
      data: ChangePassword,
      params: RequestParams = {},
    ) =>
      this.request<ChangePassword, any>({
        path: `/users/${id}/change_password/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersChangeStudentCode
     * @request POST:/users/{id}/change_student_code/
     * @secure
     */
    usersChangeStudentCode: (
      id: string,
      data: UserDetail,
      params: RequestParams = {},
    ) =>
      this.request<UserDetail, any>({
        path: `/users/${id}/change_student_code/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersDeactivate
     * @request POST:/users/{id}/deactivate/
     * @secure
     */
    usersDeactivate: (id: string, data: UserList, params: RequestParams = {}) =>
      this.request<UserList, any>({
        path: `/users/${id}/deactivate/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
