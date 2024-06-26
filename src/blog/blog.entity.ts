import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { ContentEntity } from "src/content/content.entity";
import { ImageEntity } from "src/image/image.entity";

@Entity()

export class BlogEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    bgImg: string;

    @Column({ default: false })
    active: boolean;

    @OneToMany(
        () => ContentEntity,
        (content) => content.blog,
        {
            cascade: true
        }
    )
    contents: ContentEntity[];

    @OneToMany(
        () => ImageEntity,
        (image) => image.blog
    )
    images: ImageEntity[];

    @ManyToMany(
        () => SEOEntity,
        {
            eager: true,
            cascade: true,
        }
    )
    @JoinTable()
    seos: SEOEntity[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

}

@Entity()

export class SEOEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    keyword: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

}