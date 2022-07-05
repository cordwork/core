export interface Component<T> {
	create: () => T;
	listen: (interaction) => void;
	component: T;
}